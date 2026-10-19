import { useEffect, useState } from "react";
import Header from "../components/Header";
import WebtoonCard from "../components/WebtoonCard";
import { fetchWebtoons } from "../services/webtoon";

export default function Browse() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWebtoons({ q, genre })
        .then(data => {
          setItems(data.items || []);
          setError("");
        })
        .catch(() => setError("검색에 실패했습니다."));
    }, 250);

    return () => clearTimeout(timer);
  }, [q, genre]);

  return (
    <>
      <Header />
      <main className="page">
        <span className="eyebrow">LIBRARY</span>
        <h1>작품 탐색</h1>

        <div className="search-row">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="작품명, 작가, 장르 검색"
          />

          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
          >
            <option value="">모든 장르</option>
            <option value="판타지">판타지</option>
            <option value="액션">액션</option>
            <option value="로맨스">로맨스</option>
            <option value="일상">일상</option>
            <option value="스포츠">스포츠</option>
          </select>
        </div>

        {error && <p className="notice">{error}</p>}

        <div className="toon-grid">
          {items.map(toon => (
            <WebtoonCard key={toon.id} toon={toon} />
          ))}
        </div>

        {!error && items.length === 0 && (
          <p className="notice">검색 결과가 없습니다.</p>
        )}
      </main>
    </>
  );
              }
