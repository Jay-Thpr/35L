CREATE EXTENSION IF NOT EXISTS vector;


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    preferences TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    plot TEXT,
    genres TEXT,
    director TEXT,
    cast_list TEXT,
    release_year INTEGER,
    runtime_min INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, movie_id)
);

CREATE TABLE IF NOT EXISTS user_embeddings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL
);


CREATE TABLE IF NOT EXISTS movie_embeddings (
    movie_id INTEGER PRIMARY KEY REFERENCES movies(id) ON DELETE CASCADE,
    embedding vector(1536) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_embeddings_vector
    ON user_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_movie_embeddings_vector
    ON movie_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);