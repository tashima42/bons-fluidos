package controller

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/database"
	"github.com/tashima42/bons-fluidos/hash"
)

type userSignInRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type changePasswordRequest struct {
	Password    string `json:"password" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required"`
}

func (c *Controller) SignIn(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	s := &userSignInRequest{}
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), s); err != nil {
		return err
	}

	slog.Info(requestID + ": validate body")
	if err := c.Validate.Struct(s); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info(requestID + ": starting transaction")
	tx, err := c.DB.BeginTxx(ctx.Context(), &sql.TxOptions{})
	if err != nil {
		return err
	}

	slog.Info(requestID + ": looking for user with email " + s.Email)
	user, err := database.GetUserByEmailTxx(tx, s.Email)
	if err != nil {
		slog.Info(requestID + ": error: " + err.Error())
		if !strings.Contains(err.Error(), "no rows in result set") {
			tx.Rollback()
			return fiber.NewError(http.StatusInternalServerError, err.Error())
		}
		tx.Rollback()
		return fiber.NewError(http.StatusNotFound, "email not found")
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	slog.Info(requestID + ": checking password")
	if !hash.CheckPassword(user.Password, s.Password) {
		return fiber.NewError(http.StatusUnauthorized, "incorrect password")
	}

	ac := hash.AuthClaims{}
	ac.User.ID = user.ID
	ac.User.Email = user.Email
	ac.User.Role = user.Role

	jwt, err := hash.NewJWT(c.JWTSecret, ac)
	if err != nil {
		return errors.New("failed to generate jwt: " + err.Error())
	}

	cookie := new(fiber.Cookie)
	cookie.Name = "auth-token"
	cookie.Value = jwt
	cookie.Expires = time.Now().Add(time.Hour * 24)
	cookie.HTTPOnly = true
	cookie.Secure = true
	cookie.SameSite = "None"
	ctx.Cookie(cookie)

	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"token": jwt})

}

func (c *Controller) CreateUser(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	var user *database.User
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), &user); err != nil {
		return err
	}

	slog.Info(requestID + ": validating struct")
	if err := c.Validate.Struct(user); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info(requestID + ": validating role " + user.Role)
	if user.Role != "admin" && user.Role != "volunteer" {
		return fiber.NewError(http.StatusBadRequest, "role must be either admin or volunteer")
	}

	slog.Info(requestID + ": hashing password")
	hashedPassword, err := hash.Password(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashedPassword

	slog.Info(requestID + ": creating user")
	if err := database.CreateUser(c.DB, user); err != nil {
		return errors.New(err.Error())
	}
	slog.Info(requestID + ": user created")
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) ChangePassword(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))
	user := ctx.Locals("user").(*database.User)
	s := &changePasswordRequest{}
	slog.Info(requestID + ": unmarshal request body")
	if err := json.Unmarshal(ctx.Body(), s); err != nil {
		return err
	}

	slog.Info(requestID + ": validate body")
	if err := c.Validate.Struct(s); err != nil {
		return fiber.NewError(http.StatusBadRequest, err.Error())
	}

	slog.Info(requestID + ": get user by id")
	u, err := database.GetUserByID(c.DB, user.ID)
	if err != nil {
		return fiber.NewError(http.StatusInternalServerError, "failed to get user")
	}

	slog.Info(requestID + ": checking password")
	if !hash.CheckPassword(u.Password, s.Password) {
		return fiber.NewError(http.StatusBadRequest, "incorrect password")
	}

	slog.Info(requestID + ": hashing password")
	hashedPassword, err := hash.Password(s.NewPassword)
	if err != nil {
		return err
	}

	if err := database.UpdatePassword(c.DB, hashedPassword, user.ID); err != nil {
		return fiber.NewError(http.StatusInternalServerError, "failed to update password")
	}
	slog.Info(requestID + ": password updated")
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) Me(ctx *fiber.Ctx) error {
	user := ctx.Locals("user").(*database.User)
	user.Password = ""
	return ctx.Status(http.StatusOK).JSON(user)
}

func (c *Controller) SignOut(ctx *fiber.Ctx) error {
	cookie := new(fiber.Cookie)
	cookie.Name = "auth-token"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-time.Hour * 24)
	cookie.HTTPOnly = true
	ctx.Cookie(cookie)
	return ctx.Status(http.StatusOK).JSON(map[string]interface{}{"success": true})
}

func (c *Controller) ListVolunteers(ctx *fiber.Ctx) error {
	requestID := fmt.Sprintf("%s", ctx.Locals("requestid"))

	slog.Info(requestID + ": getting volunteer users")
	users, err := database.GetVolunteerUsers(c.DB)
	if err != nil {
		if err == sql.ErrNoRows {
			return ctx.Status(http.StatusOK).JSON(make([]string, 0))
		}
		return err
	}

	if len(users) == 0 {
		return ctx.Status(http.StatusOK).JSON(make([]string, 0))
	}

	return ctx.Status(http.StatusOK).JSON(users)
}
