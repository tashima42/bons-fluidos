CREATE TABLE "volunteer" (
  "id" integer PRIMARY KEY,
  "event_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "tasks" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY('event_id') REFERENCES 'events'('id')
);
