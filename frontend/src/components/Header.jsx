import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-crown">♛</span>
        <span>
          <strong>BANGKKU</strong>
          <small>TOONGKU</small>
        </span>
      </Link>

      <nav className="nav">
        <NavLink to="/">홈</NavLink>
        <NavLink to="/browse">작품 탐색</NavLink>
        <NavLink to="/wallet">코인 지갑</NavLink>
      </nav>

      <Link to="/login" className="login-link">
        로그인
      </Link>
    </header>
  );
}
