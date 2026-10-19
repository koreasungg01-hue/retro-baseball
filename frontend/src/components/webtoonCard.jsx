import { Link } from "react-router-dom";

export default function WebtoonCard({ toon }) {
  return (
    <Link
      to={`/webtoon/${encodeURIComponent(toon.id)}`}
      className="toon-card"
    >
      <div className="cover">
        {toon.cover ? (
          <img
            src={toon.cover}
            alt={`${toon.title} 표지`}
            loading="lazy"
          />
        ) : (
          <div className="cover-placeholder">
            <span>♛</span>
            <small>BANGKKU TOONGKU</small>
          </div>
        )}
      </div>

      <div className="toon-info">
        <span className="genre">
          {toon.genre || "장르 미지정"}
        </span>

        <h3>{toon.title}</h3>

        <p>{toon.author}</p>

        <small>
          {toon.status === "completed"
            ? "완결"
            : "연재 중"}
        </small>
      </div>
    </Link>
  );
}
