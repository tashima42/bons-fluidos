package main

import (
	"errors"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/requestid"
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
		DB:        db,
		JWTSecret: []byte(jwtSecret),
		Validate:  validator.New(validator.WithRequiredStructEnabled()),
	}
	app := fiber.New(fiber.Config{ErrorHandler: cr.ErrorHandler})
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))
	app.Use(requestid.New())

	// ROUTES
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	// Unauthenticated User Routes
	//    Create User
	app.Post("/user", cr.CreateUser)
	//    Signin User
	app.Post("/user/signin", cr.SignIn)
	// Routes defined after this need authentication
	app.Use(cr.ValidateToken)
	// User routes
	//    Get Logedin User Information
	app.Get("/user/me", cr.Me)
	//    Signout user
	app.Post("/user/signout", cr.SignOut)
	// Event routes
	//    Create new event
	app.Post("/event", cr.CreateEvent)
	//    Get all events
	app.Get("/events", cr.GetEvents)
	//    Get one event
	app.Get("/event/:event_id", cr.GetEventByID)
	//    Add Volunteer to event
	app.Post("/event/:event_id/volunteer/:volunteer_id", cr.AddVolunteerToEvent)
	//    Get all event volunteers
	app.Get("/event/:event_id/volunteers", cr.EventVolunteers)
	//    Delete event
	app.Delete("/event/:event_id", cr.DeleteEvent)
	//    Remove volunteer from event
	app.Delete("/event/:event_id/volunteer/:volunteer_id", cr.RemoveVolunteerFromEvent)

	return app.Listen(":" + portFromEnv())
}

func jwtSecretFromEnv() (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", errors.New("Env Var JWT_SECRET is required")
	}
	return secret, nil
}

func portFromEnv() string {
	port := os.Getenv("PORT")
	if port == "" {
		return "3000"
	}
	return port
}

