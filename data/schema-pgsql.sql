-- Schéma pour aether-maps

CREATE TABLE points_of_interest (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  start_lat DECIMAL(10, 8) NOT NULL,
  start_lng DECIMAL(11, 8) NOT NULL,
  end_lat DECIMAL(10, 8) NOT NULL,
  end_lng DECIMAL(11, 8) NOT NULL,
  path JSONB NOT NULL, -- Array of [lat, lng] points
  distance DECIMAL(10, 2),
  duration INTERVAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE traffic (
  id SERIAL PRIMARY KEY,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  level VARCHAR(20) NOT NULL, -- low, medium, high
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);