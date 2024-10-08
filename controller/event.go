package controller

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/database"
)

func (c *Controller) CreateEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	var event database.Event
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), &event); err != nil {
		return err
	}

	if err := c.Validate.Struct(event); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info(requestID + ": starting transaction")
	tx, err := c.DB.BeginTxx(ctx.Context(), &sql.TxOptions{})
	if err != nil {
		return err
	}
	slog.Info(requestID + ": creating event")
	if err := database.CreateEventTxx(tx, &event); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "no events found"+": "+tx.Rollback().Error())
		}
		return errors.New(err.Error() + ": " + tx.Rollback().Error())
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	slog.Info(requestID + ": event created")
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) GetEventByID(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	slog.Info(requestID + ": getting event")
	event, err := database.GetEventByID(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventID)
		}
		return err
	}
	return ctx.Status(http.StatusOK).JSON(event)
}

func (c *Controller) GetEvents(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	slog.Info(requestID + ": getting events")
	events, err := database.GetEvents(c.DB)
	if err != nil {
		if err == sql.ErrNoRows {
			return ctx.Status(http.StatusOK).JSON(make([]string, 0))
		}
		return err
	}
	if len(events) == 0 {
		return ctx.Status(http.StatusOK).JSON(make([]string, 0))
	}
	return ctx.Status(http.StatusOK).JSON(events)
}

func (c *Controller) AddVolunteerToEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	volunteerID := ctx.Params("volunteer_id")
	slog.Info(requestID + ": checking volunteer_id " + requestID)
	if volunteerID == "" || volunteerID == ":volunteer_id" {
		return fiber.NewError(http.StatusBadRequest, "missing volunteer_id path param")
	}
	slog.Info(requestID + ": getting event")
	if _, err := database.GetEventByID(c.DB, eventID); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventID)
		}
		return err
	}
	slog.Info(requestID + ": getting user")
	if _, err := database.GetUserByID(c.DB, volunteerID); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "user not found: "+volunteerID)
		}
		return err
	}
	slog.Info(requestID + ": adding volunteer to event")
	if err := database.CreateEventVolunteer(c.DB, eventID, volunteerID); err != nil {
		return errors.New("error adding volunteer to event: " + err.Error())
	}
	slog.Info(requestID + ": volunteer added to event")
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) EventVolunteers(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}

	slog.Info(requestID + ": getting event")
	if _, err := database.GetEventByID(c.DB, eventID); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventID)
		}
		return err
	}

	volunteers, err := database.GetEventVolunteers(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusOK, "no volunteers found for event: "+eventID)
		}
		return err
	}
	if len(volunteers) == 0 {
		return ctx.Status(http.StatusOK).JSON(make([]string, 0))
	}
	return ctx.Status(http.StatusOK).JSON(volunteers)
}

func (c *Controller) DeleteEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	slog.Info(requestID + ": deleting event")
	tx, err := c.DB.BeginTxx(ctx.Context(), &sql.TxOptions{})
	if err != nil {
		return err
	}
	err = database.DeleteEventTxx(tx, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventID+": "+tx.Rollback().Error())
		}
		return errors.New(err.Error() + ": " + tx.Rollback().Error())
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return ctx.Status(http.StatusOK).JSON(map[string]bool{"success": true})
}

func (c *Controller) RemoveVolunteerFromEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}

	volunteerID := ctx.Params("volunteer_id")
	slog.Info(requestID + ": checking volunteer_id " + volunteerID)
	if volunteerID == "" || volunteerID == ":volunteer_id" {
		return fiber.NewError(http.StatusBadRequest, "missing volunteer_id path param")
	}

	slog.Info(requestID + ": deleting event volunteer")
	if err := database.DeleteEventVolunteer(c.DB, eventID, volunteerID); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "volunteer not found: "+volunteerID)
		}
		return err
	}
	return ctx.Status(http.StatusOK).JSON(map[string]bool{"success": true})
}

func (c *Controller) AddParticipantToEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	var eventParticipant database.EventParticipant
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), &eventParticipant); err != nil {
		return err
	}

	slog.Info(requestID + ": validating request body")
	if err := c.Validate.Struct(eventParticipant); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info(requestID + ": validating event id")
	if _, err := database.GetEventByID(c.DB, eventParticipant.EventID); err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event doesn't exists")
		}
		return err
	}

	slog.Info(requestID + ": creating event")
	if err := database.CreateEventParticipant(c.DB, &eventParticipant); err != nil {
		return err
	}
	slog.Info(requestID + ": event created")
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) ListEventParticipants(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	eventID := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventID)
	if eventID == "" || eventID == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}

	eventParticipants, err := database.GetEventParticipants(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return ctx.Status(http.StatusOK).JSON(make([]string, 0))
		}
		return err
	}
	return ctx.Status(http.StatusOK).JSON(eventParticipants)
}

func (c *Controller) EventsByParticipantRA(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	participantRA := ctx.Params("participant_ra")
	slog.Info(requestID + ": checking participant_ra " + participantRA)
	if participantRA == "" || participantRA == ":participant_ra" {
		return fiber.NewError(http.StatusBadRequest, "missing participant_ra path param")
	}

	eventParticipant, err := database.GetEventParticipantsByRA(c.DB, participantRA)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event participant doesn't exist")
		}
		return err
	}
	if len(eventParticipant) == 0 {
		return fiber.NewError(http.StatusNotFound, "participant has no events")
	}
	return ctx.Status(http.StatusOK).JSON(eventParticipant)
}
