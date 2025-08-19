CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'id',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
