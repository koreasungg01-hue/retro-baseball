import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchWebtoon } from "../services/webtoon";

export default function Viewer() {
  const { id, episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWebtoon(id)
      .then(data => {
        const found = (data.item.parts || []).find(
          item => item.id === episodeId
        );

        if (!found) throw new Error("회차를 찾을 수 없습니다.");

        setEpisode(found);
      })
      .catch(err => setError(err.message));
  }, [id, episodeId]);

  return (
    <>
      <Header />

      <main className="viewer">
        {error && <p className="notice">{error}</p>}

        {episode && (
          <>
            <h1>{episode.title}</h1>

            <div className="viewer-pages">
              {(episode.pages || []).map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`${episode.title} ${index + 1}페이지`}
                  loading={index > 1 ? "lazy" : "eager"}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
