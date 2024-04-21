package controller

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/database"
	"github.com/tashima42/bons-fluidos/hash"
)

type GlobalError struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	RequestID string `json:"requestId"`
}

func (c *Controller) ValidateToken(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	slog.Info(requestID + ": getting auth token cookie")
	token := ctx.Cookies("auth-token")
	if token == "" {
		authorizationHeader := ctx.GetReqHeaders()["authorization"]
		if len(authorizationHeader) <= 0 {
			return errors.New("missing authorization header value")
		}
		token = authorizationHeader[0]
	}
	if token == "" {
		slog.Info(requestID + ": missing auth token cookie")
		return fiber.NewError(http.StatusUnauthorized, "missing auth token")
	}
	slog.Info(requestID + ": parsing auth token")
	ac, err := hash.ParseJWT(c.JWTSecret, token)
	if err != nil {
		return err
	}
	slog.Info(requestID + ": getting user")
	user, err := database.GetUserByID(c.DB, ac.User.ID)
	if err != nil {
		return errors.New(err.Error())
	}
	slog.Info(requestID + ": seting user on local variable")
	ctx.Locals("user", user)

	return ctx.Next()
}
func (cr *Controller) ErrorHandler(ctx *fiber.Ctx, err error) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	slog.Error(requestID + ": " + err.Error())
	code := fiber.StatusInternalServerError
	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}
	err = ctx.Status(code).JSON(GlobalError{Success: false, Message: err.Error(), RequestID: requestID})
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(map[string]string{"message": err.Error()})
	}
	return nil
}
