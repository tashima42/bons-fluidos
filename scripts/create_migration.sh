#!/bin/bash

if [[ ! $1 ]]; then
  echo "create_migration requires one argument"
  exit 1
fi

migrate create -ext sql -dir database/schema_migrations -seq "$1"
