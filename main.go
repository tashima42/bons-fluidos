package main

import (
	"errors"
	"log"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/tashima42/bons-fluidos/controller"
	"github.com/tashima42/bons-fluidos/database"
)

func server() error {
  db, err := database.FromEnv()
  if err != nil {
    return errors.New("failed to open database: " + err.Error())
  }
  jwtSecret, err := jwtSecretFromEnv()
  if err != nil {
    return errors.New("failed to get jwt secret: " + err.Error())
  }
  cr := controller.Controller{
    DB: db,
    JWTSecret: []byte(jwtSecret),
    Validate:  validator.New(validator.WithRequiredStructEnabled()),
  }
  app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
  app.Post("/user", cr.CreateUser)

	return app.Listen(":3000")
}

func main() {
  if err := server(); err != nil {
    log.Fatal(err)
  }
}

func jwtSecretFromEnv() (string, error) {
  secret := os.Getenv("JWT_SECRET")
  if secret == "" {
    return "", errors.New("Env Var JWT_SECRET is required")
  }
  return secret, nil
}

