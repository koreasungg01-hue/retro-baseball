import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import WebtoonCard from "../components/WebtoonCard";
import { fetchWebtoons } from "../services/webtoon";

export default function Home() {
  const [toons, setToons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchWebtoons()
      .then(data => {
        if (active) setToons(data.items || []);
      })
      .catch(() => {
        if (active) {
          setError("작품을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR PREMIUM STORY
            </span>

            <h1>
              특별한 이야기를
              <br />
              <span>만나는 공간.</span>
            </h1>

            <p>
              당신이 기다려 온 이야기,
              이제 방꾸툰에서 만나보세요.
            </p>

            <div className="hero-actions">
              <Link to="/browse" className="button gold">
                작품 둘러보기
              </Link>

              <Link to="/signup" className="button outline">
                가입하기
              </Link>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-emblem">♛</div>
            <span>BANGKKU</span>
            <small>TOONGKU PREMIUM</small>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER</span>
              <h2>오늘의 작품</h2>
            </div>

            <Link to="/browse">전체 보기 →</Link>
          </div>

          {loading && (
            <p className="notice">작품을 불러오는 중...</p>
          )}

          {!loading && error && (
            <p className="notice">{error}</p>
          )}

          {!loading && !error && toons.length === 0 && (
            <div className="empty-state">
              <span>♛</span>
              <h3>첫 번째 이야기를 기다리는 중</h3>
              <p>
                작품 JSON을 등록하면 이곳에 표시됩니다.
              </p>
            </div>
          )}

          <div className="toon-grid">
            {toons.map(toon => (
              <WebtoonCard
                key={toon.id}
                toon={toon}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        BANGKKU TOONGKU · YOUR STORY, YOUR WORLD
      </footer>
    </>
  );
}
