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
	return ctx.JSON(map[string]interface{}{"success": true})
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
	return ctx.JSON(event)
}

func (c *Controller) GetEvents(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	slog.Info(requestID + ": getting events")
	events, err := database.GetEvents(c.DB)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "no events found")
		}
		return err
	}
	if len(events) == 0 {
		return fiber.NewError(http.StatusNotFound, "no events found")
	}
	return ctx.JSON(events)
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
	return ctx.JSON(map[string]interface{}{"success": true})
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
			return fiber.NewError(http.StatusNotFound, "no volunteers found for event: "+eventID)
		}
		return err
	}
	if len(volunteers) == 0 {
		return fiber.NewError(http.StatusNotFound, "no volunteers found for event: "+eventID)
	}
	return ctx.JSON(volunteers)
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
	return ctx.JSON(map[string]bool{"success": true})
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
	return ctx.JSON(map[string]bool{"success": true})
}
