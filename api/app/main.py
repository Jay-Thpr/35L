from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.recommend import compute_user_embedding

app = FastAPI(title="Cinematch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class RatingIn(BaseModel):
    user_id: int
    movie_id: int
    rating: int


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/recommendations")
def get_recommendations(user_id: int, limit: int = 20, db: Session = Depends(get_db)):
    user_vec = db.execute(
        text("SELECT embedding FROM user_embeddings WHERE user_id = :uid"),
        {"uid": user_id},
    ).scalar()
    if user_vec is None:
        rows = db.execute(
            text("SELECT m.id, m.title, m.plot, m.genres, m.release_year, "
                 "COUNT(r.id) AS rating_count "
                 "FROM movies m LEFT JOIN ratings r ON r.movie_id = m.id "
                 "WHERE m.id NOT IN (SELECT movie_id FROM ratings WHERE user_id = :uid) "
                 "GROUP BY m.id "
                 "ORDER BY rating_count DESC LIMIT :limit"),
            {"uid": user_id, "limit": limit},
        ).mappings().all()
        return [dict(r) for r in rows]
    rows = db.execute(
        text("SELECT m.id, m.title, m.plot, m.genres, m.release_year, "
             "e.embedding <=> CAST(:vec AS vector) AS distance, "
             "e.embedding <=> CAST(:vec AS vector) "
             "  + 0.01 * (EXTRACT(YEAR FROM CURRENT_DATE) - m.release_year) AS score "
             "FROM movie_embeddings e JOIN movies m ON m.id = e.movie_id "
             "WHERE m.id NOT IN (SELECT movie_id FROM ratings WHERE user_id = :uid) "
             "ORDER BY score ASC LIMIT :limit"),
        {"vec": user_vec, "uid": user_id, "limit": limit},
    ).mappings().all()
    return [dict(r) for r in rows]


@app.post("/ratings")
def add_rating(rating: RatingIn, db: Session = Depends(get_db)):
    db.execute(
        text("INSERT INTO ratings (user_id, movie_id, rating) "
             "VALUES (:uid, :mid, :rating) "
             "ON CONFLICT (user_id, movie_id) DO UPDATE SET rating = EXCLUDED.rating"),
        {"uid": rating.user_id, "mid": rating.movie_id, "rating": rating.rating},
    )
    db.commit()
    compute_user_embedding(db, rating.user_id)
    return {"status": "ok"}
