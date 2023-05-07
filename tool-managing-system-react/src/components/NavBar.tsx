import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
      </div>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link to="/">홈</Link>
        </li>
        <li className="nav-item">
          <Link to="/sign-in">로그인</Link>
        </li>
        <li className="nav-item">
          <Link to="/register-product">제품등록</Link>
        </li>
        <ul>
          <button type="button" onClick={() => navigate("/gogogo")}>
            누르면 이동!
          </button>
        </ul>
      </ul>
    </nav>
  );
}
