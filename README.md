# Cinematch

Cinematch is a movie discovery platform built with React and Vite. Users can sign in, look at featured movies, search for movies, rate/review movies, and edit their movie preferences! The frontend can run in a local demo mode, and the repo also includes a FastAPI recommendation backend that uses PostgreSQL and pgvector.

https://docs.google.com/presentation/d/1pD3cWYuYf8obhzIO6KTXXOynTO4zxb5rZtxlQ59pPVU/edit?slide=id.p1#slide=id.p1

## Project Requirements

| Requirement | Where It Is Implemented |
| --- | --- |
| Dynamic data display | The user can search for movies through the TMDB API is the "search" page. On the home page, users are dynamically displayed movies based on the moveis they previously rated. Our backend implementation of our vector embeddings for our RAG pipeline can be found in `/api/...`|
| Client upload to backend | Users can update their profile information in the "profile" page. they can set their display name, favorite movie, and add a short bio. This information is stored in our supabase DB. Additionally, we have each movie rating be stored in our backend, with the ratings contributing to the weights of a user's vector embeddings. |
| Authentication/security | Users are required to login with email to access the website. Individual profiles are only viewable if logged in. We implemented authentication using Supabase Auth, which handles password hashing & storing passwords. Users are unable to access other users' data through our RLS (row level security) on supabase. |
| Server-side search | The search page queries TMDB's movie API for live server data and falls back to local demo results when no API key is configured. The recommendation backend also exposes server endpoints for movie recommendations and similar-movie lookup through FastAPI. |
| Three distinct features | 1. Our app displays recommended movies, displaying movies that match a user’s vector embeddings. 2. Our app allows searching for movies, where users are able to search up movies, look at them, and save their rating from 1 to 5. 3. Our app allows individuals to edit their user profile to edit their information and movie preferences.|
| Git/version control | We practiced good Git practices in our process of making this app, with each team member working together on portions, committing incrementally, and each working on our respective branches |
| Local setup | See below |
| Visual design/navigation | We took inspiration from Netflix, with our home page recommending moveis in a similar layout as that. We tried to keep our pages simple and not confusing, with our sign-in and profile pages having standard UI. |
| Readable code | The project is organized into clear frontend and backend areas. The React frontend in `src/` is split into focused page/component files such as `App.jsx`, `HomePage.jsx`, `SearchPage.jsx`, `ProfilePage.jsx`, `MovieCard.jsx`, and `ReviewModal.jsx`, with separate CSS files for each major UI area. API-related logic is separated into helper modules like `profileApi.js`, `recommendationsApi.js`, and `supabaseClient.js`, so components are not overloaded with database/client setup code. The backend is isolated under `api/app/`, with FastAPI routes in `main.py`, database setup in `db.py`, config in `config.py`, and recommendation-vector logic in `recommend.py`. |
| 2+ E2E tests | Our project has 5 automated Playwright end-to-end tests across `e2e/auth.spec.js` and `e2e/search.spec.js`. The auth tests cover rendering the login page, successful demo login, missing-password validation, redirecting to the home page, and displaying authenticated movie content. The search tests log in, navigate to `/search`, verify movie search results for "Inception," and verify the empty-state UI for a no-result query. These tests can be run with `npm run test:e2e`, and `playwright.config.js` automatically starts the Vite dev server before testing. |
| Architecture diagrams | See diagrams below |


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
VITE_API_URL=http://localhost:8000
```

If the Supabase variables are not set, the frontend runs in demo mode with a local demo user. If `VITE_TMDB_API_KEY` is not set, search falls back to a small local movie list. `VITE_API_URL` is only needed when connecting the React app to the local FastAPI recommendation server.

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

Make sure the repository root `.env` includes:

```env
VITE_API_URL=http://localhost:8000
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/cinematch
TMDB_API_KEY=your_tmdb_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
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

If Playwright browsers have not been installed on your machine yet, run this once before the E2E tests:

```bash
npx playwright install
```

## Architecture

### Frontend and Auth/Data Flow

![Frontend and auth/data flow diagram](public/architecture-component-diagram.png)

The frontend is a React/Vite single-page app. React Router protects the main pages behind login state, Supabase handles real authentication and profile/rating persistence when configured, TMDB supplies live movie search results, and the optional FastAPI service provides recommendation data from PostgreSQL and pgvector.

### Backend Recommendation Flow

![Backend recommendation sequence diagram](public/architecture-sequence-diagram.png)

The backend stores movies, ratings, user embeddings, and movie embeddings. Seeding pulls movies from TMDB, `api/embed_movies.py` generates vector embeddings with OpenAI, and the recommendation route ranks unseen movies by vector similarity to the user's liked movies.

## Troubleshooting

If login does not use Supabase, confirm that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`.

If movie search only returns the fallback movies, confirm that `VITE_TMDB_API_KEY` is set and restart the Vite server.

If backend startup fails, confirm that PostgreSQL is running and that `DATABASE_URL` points to the correct database.

If recommendation queries fail, confirm that pgvector is installed and that `api/db/schema.sql` has been applied.

If environment variable changes do not appear in the frontend, stop and restart `npm run dev`. Vite only loads `.env` values when the dev server starts.
