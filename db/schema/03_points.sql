-- Drop and recreate points table

DROP TABLE IF EXISTS points CASCADE;
CREATE TABLE points (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  title VARCHAR(255) ,
  description VARCHAR(255) ,
  image_url VARCHAR(750) ,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  leaflet_id INTEGER DEFAULT -1
);
