-- Migration number: 0001 	 2026-10-26T20:30:06.917Z
CREATE TABLE photos (
  id             TEXT PRIMARY KEY,              -- generated in the Worker with crypto.randomUUID()
  key            TEXT NOT NULL UNIQUE,          -- path in R2, e.g. photos/mjavatn.jpg
  title          TEXT NOT NULL,
  alt            TEXT,
  category       TEXT,
  width          INTEGER,
  height         INTEGER,
  dominant_color TEXT,                          -- hex, e.g. #3a5f7d
  hue            INTEGER,                       -- 0-359, for sorting by color
  saturation     REAL,                          -- 0-1
  lightness      REAL,                          -- 0-1
  taken_at       TEXT,                          -- ISO 8601 from EXIF
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_photos_status   ON photos (status);
CREATE INDEX idx_photos_category ON photos (category);
CREATE INDEX idx_photos_hue      ON photos (hue);
CREATE INDEX idx_photos_taken_at ON photos (taken_at);