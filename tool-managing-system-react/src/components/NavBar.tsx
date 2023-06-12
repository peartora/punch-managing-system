import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="container">
        <a className="navbar-brand" href="#">
          <h4>Punch Managing System</h4>
        </a>

        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              홈
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sign-in">
              로그인
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register-product">
              제품등록
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register-punch">
              펀치등록
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/modify-product">
              제품정보 변경
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add-supplier">
              업체 등록
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
