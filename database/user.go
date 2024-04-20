package database

import (
	"time"

	"github.com/jmoiron/sqlx"
)

type User struct {
	ID        int    `db:"id" json:"id"`
	Name      string    `db:"name" json:"name" validate:"required"`
	Email     string    `db:"email" json:"email" validate:"required"`
	Password  string    `db:"password" json:"password" validate:"required"`
	Role      string  `db:"role"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

func CreateUserTxx(tx *sqlx.Tx, u *User) error {
	query := "INSERT INTO users(role, name, email, password, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6);"
	_, err := tx.Exec(query, u.Role, u.Name, u.Email, u.Password, time.Now(), time.Now())
	return err
}

