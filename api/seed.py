import sys
import time
import requests
from sqlalchemy import text
from app.db import SessionLocal
from app.config import get_settings


BASE_URL = "https://api.themoviedb.org/3"
NUM_PAGES = 15


def main():
    settings = get_settings()
    if not settings.tmdb_api_key:
        print("TMDB_API_KEY not set in .env")
        sys.exit(1)

    key = settings.tmdb_api_key

    genre_resp = requests.get(f"{BASE_URL}/genre/movie/list", params={"api_key": key})
    genre_map = {g["id"]: g["name"] for g in genre_resp.json()["genres"]}

    session = SessionLocal()
    inserted = 0

    for page in range(1, NUM_PAGES + 1):
        resp = requests.get(
            f"{BASE_URL}/movie/top_rated",
            params={"api_key": key, "page": page},
        )
        for m in resp.json().get("results", []):
            genres = ", ".join(
                genre_map[gid] for gid in m.get("genre_ids", []) if gid in genre_map
            )
            release_date = m.get("release_date") or ""
            year_str = release_date[:4]
            release_year = int(year_str) if year_str.isdigit() else None
            session.execute(
                text("INSERT INTO movies (id, title, overview, genres, release_year) "
                     "VALUES (:id, :title, :overview, :genres, :year) "
                     "ON CONFLICT (id) DO NOTHING"),
                {
                    "id": m["id"],
                    "title": m["title"],
                    "overview": m.get("overview", ""),
                    "genres": genres,
                    "year": release_year,
                },
            )
            inserted += 1
            print(f"{inserted}: {m['title']}")
        session.commit()
        time.sleep(0.25)

    session.close()
    print(f"done. inserted {inserted} movies.")


main()
