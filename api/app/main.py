from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db import SessionLocal

app = FastAPI(title="Cinematch API", version="0.1.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
        return []
    rows = db.execute(
        text("SELECT m.id, m.title, m.plot, m.genres, m.release_year, "
             "e.embedding <=> CAST(:vec AS vector) AS distance "
             "FROM movie_embeddings e JOIN movies m ON m.id = e.movie_id "
             "WHERE m.id NOT IN (SELECT movie_id FROM ratings WHERE user_id = :uid) "
             "ORDER BY distance ASC LIMIT :limit"),
        {"vec": user_vec, "uid": user_id, "limit": limit},
    ).mappings().all()
    return [dict(r) for r in rows]
