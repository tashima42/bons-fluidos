PRAGMA foreign_keys=ON;

CREATE TABLE "user_event" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "event_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY('event_id') REFERENCES 'events'('id'),
  FOREIGN KEY('user_id') REFERENCES 'users'('id')
);
