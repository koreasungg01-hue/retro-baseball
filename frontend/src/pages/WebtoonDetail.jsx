import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchWebtoon } from "../services/webtoon";

export default function WebtoonDetail() {
  const { id } = useParams();
  const [toon, setToon] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWebtoon(id)
      .then(data => setToon(data.item))
      .catch(err => setError(err.message));
  }, [id]);

  return (
    <>
      <Header />
      <main className="page">
        {error && <p className="notice">{error}</p>}

        {!toon && !error && (
          <p className="notice">작품을 불러오는 중...</p>
        )}

        {toon && (
          <>
            <div className="detail-layout">
              <div className="detail-cover">
                {toon.cover && (
                  <img src={toon.cover} alt={toon.title} />
                )}
              </div>

              <div>
                <span className="eyebrow">{toon.genre}</span>
                <h1>{toon.title}</h1>
                <p>작가 · {toon.author}</p>
                <p>{toon.explain}</p>
                <span className="status">
                  {toon.status === "completed"
                    ? "완결"
                    : "연재 중"}
                </span>
              </div>
            </div>

            <h2>회차 목록</h2>

            {(toon.parts || []).map((episode, index) => (
              <Link
                className="episode-row"
                key={episode.id}
                to={`/viewer/${encodeURIComponent(toon.id)}/${encodeURIComponent(episode.id)}`}
              >
                <span>
                  {index + 1}. {episode.title}
                </span>
                <span>
                  {episode.price === 0
                    ? "무료"
                    : `${episode.price} 코인`}
                }
              </Link>
            ))}
          </>
        )}
      </main>
    </>
  );
}
