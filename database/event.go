package database

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Event struct {
	ID          string    `db:"id" json:"id"`
	Name        string    `db:"name" json:"name" validate:"required"`
	Description string    `db:"description" json:"description" validate:"required"`
	Location    string    `db:"location" json:"location" validate:"required"`
	StartDate   time.Time `db:"start_date" json:"startDate"`
	EndDate     time.Time `db:"end_date" json:"endDate"`
	Speaker     struct {
		Name        string `db:"speaker_name" json:"name" validate:"required"`
		PhoneNumber string `db:"speaker_phone_number" json:"phoneNumber" validate:"required"`
		Email       string `db:"speaker_email" json:"email" validate:"required,email"`
		Description string `db:"speaker_description" json:"description" validate:"required"`
	} `json:"speaker" validate:"required"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type Volunteer struct {
	ID        string    `db:"id" json:"id"`
	EventID   string    `db:"event_id" json:"eventId"`
	Name      string    `db:"name" json:"name" validate:"required"`
	Tasks     string    `db:"tasks" json:"tasks" validate:"required"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

func CreateEventTxx(tx *sqlx.Tx, e *Event) error {
	id := uuid.New()
	query := "INSERT INTO events(id, name, description, location, start_date, end_date, speaker_name, speaker_phone_number, speaker_email, speaker_description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);"
	_, err := tx.Exec(query, id, e.Name, e.Description, e.Location, e.StartDate, e.EndDate, e.Speaker.Name, e.Speaker.PhoneNumber, e.Speaker.Email, e.Speaker.Description)
	return err
}

func GetEventByID(db *sqlx.DB, id string) (*Event, error) {
	query := "SELECT id, name, description, location, start_date, end_date, speaker_name, speaker_phone_number, speaker_email, speaker_description, created_at, updated_at FROM events WHERE id=? LIMIT 1;"
	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, err
	}
	e := new(Event)
	err = stmt.QueryRow(id).Scan(&e.ID, &e.Name, &e.Description, &e.Location, &e.StartDate, &e.EndDate, &e.Speaker.Name, &e.Speaker.PhoneNumber, &e.Speaker.Email, &e.Speaker.Description, &e.CreatedAt, &e.UpdatedAt)
	return e, err
}

func GetEvents(db *sqlx.DB) ([]Event, error) {
	events := make([]Event, 0)
	query := "SELECT id, name, description, location, start_date, end_date, speaker_name, speaker_phone_number, speaker_email, speaker_description, created_at, updated_at FROM events;"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var e Event
		if err := rows.Scan(&e.ID, &e.Name, &e.Description, &e.Location, &e.StartDate, &e.EndDate, &e.Speaker.Name, &e.Speaker.PhoneNumber, &e.Speaker.Email, &e.Speaker.Description, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}

func GetEventVolunteers(db *sqlx.DB, eventID string) ([]Volunteer, error) {
	volunteers := make([]Volunteer, 0)
	query := "SELECT id, event_id, name, tasks, created_at, updated_at FROM volunteers WHERE event_id=?;"
	rows, err := db.Query(query, eventID)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var v Volunteer
		if err := rows.Scan(&v.ID, &v.EventID, &v.Name, &v.Tasks, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, err
		}
		volunteers = append(volunteers, v)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return volunteers, nil
}

func CreateEventVolunteerTxx(tx *sqlx.Tx, v *Volunteer) error {
	id := uuid.New()
	query := "INSERT INTO volunteers(id, event_id, name, tasks) VALUES($1, $2, $3, $4);"
	_, err := tx.Exec(query, id, v.EventID, v.Name, v.Tasks)
	return err
}

func DeleteEventTxx(tx *sqlx.Tx, eventID string) error {
	volunteersQuery := "DELETE FROM volunteers WHERE event_id=$1;"
	_, err := tx.Exec(volunteersQuery, eventID)
	if err != nil {
		return err
	}
	eventsQuery := "DELETE FROM events WHERE id=$1;"
	result, err := tx.Exec(eventsQuery, eventID)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func DeleteEventVolunteerTxx(db *sqlx.DB, volunteerID string) error {
	query := "DELETE FROM volunteers WHERE id=$1;"
	result, err := db.Exec(query, volunteerID)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}
