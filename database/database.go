package database

import (
	"embed"
	"errors"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

//go:embed schema_migrations
var schemaMigrations embed.FS

func FromEnv() (*sqlx.DB, error){
  path := os.Getenv("DATABASE_PATH")
  if path == "" {
    return nil, errors.New("Env Var DATABASE_PATH is required")
  }
  return Open(path)
}

func Open(path string) (*sqlx.DB, error) {
	m, err := newMigrate(path)
	if err != nil {
		return nil, err
	}
	if err := m.Up(); err != nil {
		if err != migrate.ErrNoChange {
			return nil, err
		}
	}
	return sqlx.Open("sqlite", path)
}

func Close(db *sqlx.DB) error {
	return db.Close()
}

func newMigrate(path string) (*migrate.Migrate, error) {
	d, err := iofs.New(schemaMigrations, "schema_migrations")
	if err != nil {
		return nil, err
	}
	return migrate.NewWithSourceInstance("iofs", d, "sqlite://"+path)
}

