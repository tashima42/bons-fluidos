package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/database"
)

func (c *Controller) CreateVolunteerForm(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	v := database.VolunteerForm{}
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), &v); err != nil {
		return err
	}

	slog.Info(requestID + ": validate body")
	if err := c.Validate.Struct(v); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	if err := database.CreateVolunteerForm(c.DB, &v); err != nil {
		return err
	}

	return ctx.Status(http.StatusOK).JSON(map[string]bool{"success": true})
}

func (c *Controller) GetVolunteerForms(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	slog.Info(requestID + ": getting volunteer forms")
	volunteerForms, err := database.GetVolunteerForms(c.DB)
	if err != nil {
		if err == sql.ErrNoRows {
			return fiber.NewError(http.StatusNotFound, "no volunteer forms found")
		}
		return err
	}

	if len(volunteerForms) == 0 {
		return fiber.NewError(http.StatusNotFound, "no volunteer forms found")
	}

	return ctx.Status(http.StatusOK).JSON(volunteerForms)
}
