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

func GetEventVolunteers(db *sqlx.DB, eventID string) ([]User, error) {
	volunteers := make([]User, 0)
	query := "SELECT u.id, u.name, u.email, u.role, u.created_at, u.updated_at FROM user_event e JOIN users u ON e.user_id = u.id WHERE e.event_id=$1;"
	rows, err := db.Query(query, eventID)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		volunteers = append(volunteers, u)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return volunteers, nil
}

func CreateEventVolunteer(db *sqlx.DB, eventID, userID string) error {
	id := uuid.New()
	query := "INSERT INTO user_event(id, event_id, user_id) VALUES($1, $2, $3);"
	_, err := db.Exec(query, id, eventID, userID)
	return err
}

func DeleteEventTxx(tx *sqlx.Tx, eventID string) error {
	volunteersQuery := "DELETE FROM user_event WHERE event_id=$1;"
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

func DeleteEventVolunteer(db *sqlx.DB, eventID, userID string) error {
	query := "DELETE FROM user_event WHERE event_id=$1 AND user_id=$2;"
	result, err := db.Exec(query, eventID, userID)
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

