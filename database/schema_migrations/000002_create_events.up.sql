CREATE TABLE "events" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "start_date" DATETIME NOT NULL,
  "end_date" DATETIME NOT NULL,
  "speaker_name" TEXT NOT NULL,
  "speaker_phone_number" TEXT NOT NULL,
  "speaker_email" TEXT NOT NULL,
  "speaker_description" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
