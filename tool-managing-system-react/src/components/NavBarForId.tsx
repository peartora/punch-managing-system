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
            <Link className="nav-link" to="/delete-punch">
              폐기 펀치 list
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
