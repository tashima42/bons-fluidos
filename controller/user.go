package controller

import (
	"database/sql"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/database"
	"github.com/tashima42/bons-fluidos/hash"
)

func (c *Controller) CreateUser(ctx *fiber.Ctx) error {
	user := &database.User{}
	slog.Info("unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), user); err != nil {
		return err
	}

	if err := c.Validate.Struct(user); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info("starting transaction")
	tx, err := c.DB.BeginTxx(ctx.Context(), &sql.TxOptions{})
	if err != nil {
		return err
	}

	slog.Info("hashing password")
	hashedPassword, err := hash.Password(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	slog.Info("creating user")
	if err := database.CreateUserTxx(tx, user); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	slog.Info("user created")
	return ctx.JSON(map[string]interface{}{"success": true})
}

