CREATE TABLE "event_participants" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "event_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "ra" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY('event_id') REFERENCES 'events'('id')
);