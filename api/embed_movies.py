import sys
from openai import OpenAI
from sqlalchemy import text
from app.db import SessionLocal
from app.config import get_settings


EMBED_MODEL = "text-embedding-3-small"
BATCH_SIZE = 50


def build_text(row):
    parts = [row.title]
    if row.genres:
        parts.append(row.genres)
    if row.director:
        parts.append(f"directed by {row.director}")
    if row.cast_list:
        parts.append(f"starring {row.cast_list}")
    if row.plot:
        parts.append(row.plot)
    return ". ".join(parts)


def main():
    settings = get_settings()
    if not settings.openai_api_key:
        print("OPENAI_API_KEY not set in .env")
        sys.exit(1)

    client = OpenAI(api_key=settings.openai_api_key)
    session = SessionLocal()

    rows = session.execute(text(
        "SELECT m.id, m.title, m.plot, m.genres, m.director, m.cast_list "
        "FROM movies m LEFT JOIN movie_embeddings e ON e.movie_id = m.id "
        "WHERE e.movie_id IS NULL ORDER BY m.id"
    )).all()

    if not rows:
        print("all movies already embedded")
        session.close()
        return

    print(f"embedding {len(rows)} movies")
    done = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        texts = [build_text(r) for r in batch]
        resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
        for row, item in zip(batch, resp.data):
            vec_str = "[" + ",".join(str(x) for x in item.embedding) + "]"
            session.execute(
                text("INSERT INTO movie_embeddings (movie_id, embedding) "
                     "VALUES (:mid, CAST(:v AS vector)) "
                     "ON CONFLICT (movie_id) DO UPDATE SET embedding = EXCLUDED.embedding"),
                {"mid": row.id, "v": vec_str},
            )
            done += 1
            print(f"{done}: {row.title}")
        session.commit()

    session.close()
    print(f"done. embedded {done} movies.")


main()
