package database

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type User struct {
	ID        string    `db:"id" json:"id"`
	Name      string    `db:"name" json:"name" validate:"required"`
	Email     string    `db:"email" json:"email" validate:"required,email"`
	Password  string    `db:"password" json:"password,omitempty" validate:"required"`
	Role      string    `db:"role" json:"role" validate:"required"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

func CreateUser(db *sqlx.DB, u *User) error {
	id := uuid.New()
	query := "INSERT INTO users(id, role, name, email, password) VALUES($1, $2, $3, $4, $5);"
	_, err := db.Exec(query, id, u.Role, u.Name, u.Email, u.Password)
	return err
}

func UpdatePassword(db *sqlx.DB, password, id string) error {
  query := "UPDATE users SET password = $1, updated_at = $2 WHERE id = $3;"
  _, err := db.Exec(query, password, time.Now(), id)
  return err
}

func GetUserByEmailTxx(tx *sqlx.Tx, email string) (*User, error) {
	var u User
	query := "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email=$1 LIMIT 1;"
	err := tx.Get(&u, query, email)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func GetUserByID(db *sqlx.DB, id string) (*User, error) {
	var u User
	query := "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE id=$1 LIMIT 1;"
	err := db.Get(&u, query, id)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
