package database

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type VolunteerForm struct {
	ID        string    `db:"id" json:"id"`
	Name      string    `db:"name" json:"name" validate:"required"`
	Phone     string    `db:"phone" json:"phone" validate:"required"`
	Email     string    `db:"email" json:"email" validate:"required,email"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

func CreateVolunteerForm(db *sqlx.DB, v *VolunteerForm) error {
	id := uuid.New()
	query := "INSERT INTO volunteer_forms(id, name, email, phone) VALUES($1, $2, $3, $4);"
	_, err := db.Exec(query, id, v.Name, v.Name, v.Email, v.Phone)
	return err
}

func GetVolunteerForms(db *sqlx.DB) ([]VolunteerForm, error) {
	volunteerForms := make([]VolunteerForm, 0)
	query := "SELECT id, name, email, phone, created_at, updated_at FROM volunteer_forms;"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var v VolunteerForm
		if err := rows.Scan(&v.ID, &v.Name, &v.Email, &v.Phone, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, err
		}
		volunteerForms = append(volunteerForms, v)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return volunteerForms, nil
}
