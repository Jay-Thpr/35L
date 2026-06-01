# Cinematch

Cinematch is a movie discovery platform built with React and Vite. Users can sign in, look at featured movies, search for movies, rate/review movies, and edit their movie preferences! The frontend can run in a local demo mode, and the repo also includes a FastAPI recommendation backend that uses PostgreSQL and pgvector.

## Prerequisites

Install these before running the project locally:

- Node.js and npm
- Python 3.10 or newer, only needed for the backend API
- PostgreSQL, only needed for the backend API
- pgvector PostgreSQL extension, only needed for recommendations
- A TMDB API key for live movie search
- A Supabase project for real authentication, profiles, and ratings
- An OpenAI API key, only needed if generating movie embeddings

## Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

The frontend reads these Vite variables:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

If the Supabase variables are not set, the frontend runs in demo mode with a local demo user. If `VITE_TMDB_API_KEY` is not set, search falls back to a small local movie list.

The backend scripts and API also use these variables:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/cinematch
TMDB_API_KEY=your_tmdb_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Do not commit real API keys or database credentials.

## Install Frontend Dependencies

From the repository root:

```bash
npm install
```

## Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

The main routes are:

- `/login` for login
- `/signup` for account creation
- `/` for the home page
- `/search` for movie search
- `/profile` for profile editing

## Supabase Setup

Supabase is optional for local UI development, but required for real authentication, persisted profile edits, and saved ratings.

The frontend expects these tables:

- `users`: stores user profile data
- `ratings`: stores movie ratings by user and movie

Profile preferences are stored in the `users.preferences` field as a JSON string. Ratings are upserted by `user_id` and `movie_id`.

If you are using the SQL schema in this repo, apply:

```bash
psql cinematch < api/db/schema.sql
```

The schema creates:

- `users`
- `movies`
- `ratings`
- `user_embeddings`
- `movie_embeddings`

## Optional Backend API

The FastAPI backend is used for recommendation endpoints. The current React frontend does not need this API to render the main app, but it can be run locally for backend development.

Create and activate a Python virtual environment:

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Create the local database:

```bash
createdb cinematch
psql cinematch < db/schema.sql
```

Seed movies from TMDB:

```bash
python seed.py
```

Generate movie embeddings with OpenAI:

```bash
python embed_movies.py
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The API runs at:

```text
http://localhost:8000
```

Available API routes include:

- `GET /health`
- `GET /recommendations?user_id=1&limit=20`
- `POST /ratings`
- `GET /movies/{movie_id}/similar`

## Local Checks

Build the frontend:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Run Playwright end-to-end tests:

```bash
npm run test:e2e
```

The Playwright config automatically starts the Vite dev server at `http://localhost:5173` if one is not already running.

## Troubleshooting

If login does not use Supabase, confirm that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`.

If movie search only returns the fallback movies, confirm that `VITE_TMDB_API_KEY` is set and restart the Vite server.

If backend startup fails, confirm that PostgreSQL is running and that `DATABASE_URL` points to the correct database.

If recommendation queries fail, confirm that pgvector is installed and that `api/db/schema.sql` has been applied.

If environment variable changes do not appear in the frontend, stop and restart `npm run dev`. Vite only loads `.env` values when the dev server starts.
