import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import WebtoonDetail from "./pages/WebtoonDetail";
import Viewer from "./pages/Viewer";

function Placeholder({ title }) {
  return (
    <main className="page">
      <span className="eyebrow">BANGKKU TOONGKU</span>
      <h1>{title}</h1>
      <p className="notice">
        이 화면은 다음 모듈에서 구현합니다.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/webtoon/:id" element={<WebtoonDetail />} />
      <Route
        path="/viewer/:id/:episodeId"
        element={<Viewer />}
      />

      <Route path="/login" element={<Placeholder title="로그인" />} />
      <Route path="/signup" element={<Placeholder title="회원가입" />} />
      <Route path="/invite" element={<Placeholder title="초대 코드" />} />
      <Route path="/wallet" element={<Placeholder title="코인 지갑" />} />
      <Route path="/mypage" element={<Placeholder title="마이페이지" />} />
      <Route path="/admin" element={<Placeholder title="관리자 센터" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
