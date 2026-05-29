from sqlalchemy import text
  
def compute_user_embedding(session, user_id):
    avg_vec = session.execute(
        text("SELECT avg(e.embedding) FROM ratings r "
            "JOIN movie_embeddings e ON e.movie_id = r.movie_id "
            "WHERE r.user_id = :uid AND r.rating >= 4"),
        {"uid": user_id},
    ).scalar()
      
    if avg_vec is None:
        return None
    session.execute(
        text("INSERT INTO user_embeddings (user_id, embedding) "
            "VALUES (:uid, CAST(:emb AS vector)) "
            "ON CONFLICT (user_id) DO UPDATE SET embedding = EXCLUDED.embedding"),
        {"uid": user_id, "emb": avg_vec},
    )
    session.commit()
    return avg_vec
