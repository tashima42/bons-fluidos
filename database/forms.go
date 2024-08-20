package database

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

const layout = "2006-01-02 15:04:05"

type VolunteerForm struct {
	ID        string     `db:"id" json:"id"`
	Name      string     `db:"name" json:"name" validate:"required"`
	Phone     string     `db:"phone" json:"phone" validate:"required"`
	Email     string     `db:"email" json:"email" validate:"required,email"`
	Type      string     `db:"type" json:"type" validate:"required,oneof=volunteer speaker"`
	EventName string     `db:"event_name" json:"eventName,omitempty"`
	EventDate *time.Time `db:"event_date" json:"eventDate,omitempty"`
	CreatedAt time.Time  `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time  `db:"updated_at" json:"updatedAt"`
}

func CreateVolunteerForm(db *sqlx.DB, v *VolunteerForm) error {
	id := uuid.New()
	query := "INSERT INTO volunteer_forms(id, name, email, phone, type, event_name, event_date) VALUES($1, $2, $3, $4, $5, $6, $7);"
	eventDate := ""
	log.Printf("v: %+v", v)
	log.Printf("event date: %+v", v.EventDate)
	if v.EventDate != nil {
		eventDate = v.EventDate.Format(layout)
	}

	_, err := db.Exec(query, id, v.Name, v.Email, v.Phone, v.Type, v.EventName, eventDate)
	return err
}

func GetVolunteerForms(db *sqlx.DB) ([]VolunteerForm, error) {
	volunteerForms := make([]VolunteerForm, 0)
	query := "SELECT id, name, email, phone, type, event_name, event_date, created_at, updated_at FROM volunteer_forms;"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var v VolunteerForm
		var date string
		if err := rows.Scan(&v.ID, &v.Name, &v.Email, &v.Phone, &v.Type, &v.EventName, &date, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, err
		}
		log.Println(date)
		if date != "" && date != " " {
			parsedDate, err := time.Parse(time.RFC3339, date)
			if err != nil {
				return nil, err
			}
			v.EventDate = &parsedDate
		}
		volunteerForms = append(volunteerForms, v)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return volunteerForms, nil
}
