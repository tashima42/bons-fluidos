package controller

import (
	"github.com/go-playground/validator/v10"
	"github.com/jmoiron/sqlx"
)

type Controller struct {
	DB        *sqlx.DB
	JWTSecret []byte
	Validate  *validator.Validate
}

