package controller

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

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
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	slog.Info(requestID + ": event created")
	return ctx.JSON(map[string]interface{}{"success": true})
}

func (c *Controller) GetEventByID(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	eventIDParam := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventIDParam)
	if eventIDParam == "" || eventIDParam == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	slog.Info(requestID + ": converting event_id to int")
	eventID, err := strconv.Atoi(eventIDParam)
	if err != nil {
		return err
	}
	slog.Info(requestID + ": getting event")
	event, err := database.GetEventByID(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventIDParam)
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
	return ctx.JSON(events)
}

func (c *Controller) AddVolunteerToEvent(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	slog.Info(requestID + ": unmarshal request body")
	var volunteer database.Volunteer
	if err := json.Unmarshal(ctx.Body(), &volunteer); err != nil {
		return err
	}
	slog.Info(requestID + ": validate body")
	if err := c.Validate.Struct(volunteer); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}
	eventIDParam := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventIDParam)
	if eventIDParam == "" || eventIDParam == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	slog.Info(requestID + ": converting event_id to int")
	eventID, err := strconv.Atoi(eventIDParam)
	if err != nil {
		return err
	}
	slog.Info(requestID + ": getting event")
	_, err = database.GetEventByID(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventIDParam)
		}
		return err
	}
	volunteer.EventID = eventID
	slog.Info(requestID + ": starting transaction")
	tx, err := c.DB.BeginTxx(ctx.Context(), &sql.TxOptions{})
	if err != nil {
		return err
	}
	slog.Info(requestID + ": adding volunteer to event")
	if err := database.CreateEventVolunteerTxx(tx, &volunteer); err != nil {
		return errors.New("error adding volunteer to event: " + err.Error() + ": " + tx.Rollback().Error())
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	slog.Info(requestID + ": volunteer added to event")
	return ctx.JSON(map[string]interface{}{"success": true})
}

func (c *Controller) EventVolunteers(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	eventIDParam := ctx.Params("event_id")
	slog.Info(requestID + ": checking event_id " + eventIDParam)
	if eventIDParam == "" || eventIDParam == ":event_id" {
		return fiber.NewError(http.StatusBadRequest, "missing event_id path param")
	}
	slog.Info(requestID + ": converting event_id to int")
	eventID, err := strconv.Atoi(eventIDParam)
	if err != nil {
		return err
	}
	slog.Info(requestID + ": getting event")
	_, err = database.GetEventByID(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "event not found: "+eventIDParam)
		}
		return err
	}
	volunteers, err := database.GetEventVolunteers(c.DB, eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "no volunteers found for event: "+eventIDParam)
		}
		return err
	}
	if len(volunteers) == 0 {
		return fiber.NewError(http.StatusNotFound, "no volunteers found for event: "+eventIDParam)
	}
	return ctx.JSON(volunteers)
}
