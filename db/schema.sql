DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL
);

CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  search_term varchar(255) NOT NULL,
  created_at timestamp NOT NULL default now(),
  user_id INTEGER NOT NULL REFERENCES users(id)
);
