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
		AllowOrigins: "http://localhost:3000, https://bons-fluidos.vercel.app",
	}))
	app.Use(requestid.New())

	// ROUTES
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	// Unauthenticated User Routes
	//    Signin User
	app.Post("/user/signin", cr.SignIn)

	//    Create User
	app.Post("/user", cr.ValidateToken, cr.ValidateRoleAdmin, cr.CreateUser)
	// User routes
	//    Get Logedin User Information
	app.Get("/user/me", cr.ValidateToken, cr.Me)
	//    Update user password
	app.Patch("/user/password", cr.ValidateToken, cr.ChangePassword)
	//    Signout user
	app.Post("/user/signout", cr.ValidateToken, cr.SignOut)
	// Event routes
	//    Create new event
	app.Post("/event", cr.ValidateToken, cr.ValidateRoleAdmin, cr.CreateEvent)
	//    Get all events
	app.Get("/events", cr.GetEvents)
	//    Get one event
	app.Get("/event/:event_id", cr.GetEventByID)
	//    Add Volunteer to event
	app.Post("/event/:event_id/volunteer/:volunteer_id", cr.ValidateToken, cr.ValidateRoleAdmin, cr.AddVolunteerToEvent)
	//    Get all event volunteers
	app.Get("/event/:event_id/volunteers", cr.ValidateToken, cr.EventVolunteers)
	//    Delete event
	app.Delete("/event/:event_id", cr.ValidateToken, cr.ValidateRoleAdmin, cr.DeleteEvent)
	//    Remove volunteer from event
	app.Delete("/event/:event_id/volunteer/:volunteer_id", cr.ValidateToken, cr.ValidateRoleAdmin, cr.RemoveVolunteerFromEvent)
	//    Add participant to event
	app.Post("/event/participant", cr.ValidateToken, cr.AddParticipantToEvent)
	//    Get event participants
	app.Get("/event/:event_id/participants", cr.ValidateToken, cr.ListEventParticipants)
	//    Get events by participant
	app.Get("/events/participant/:participant_ra", cr.EventsByParticipantRA)

	// Volunteer Forms
	//    Create Volunteer Form
	app.Post("/forms/volunteer", cr.CreateVolunteerForm)
	//    Get Volunteer Forms
	app.Get("/forms/volunteer", cr.ValidateToken, cr.GetVolunteerForms)

	return app.Listen(":" + portFromEnv())
}

func jwtSecretFromEnv() (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", errors.New("env var JWT_SECRET is required")
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
