CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  event_organizer TEXT,
  event TEXT,
  tags TEXT[],
  UNIQUE (from_address, to_address, event, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_event_organizer ON connections(event_organizer);
CREATE INDEX IF NOT EXISTS idx_event ON connections(event);
CREATE INDEX IF NOT EXISTS idx_tags ON connections USING GIN(tags);
