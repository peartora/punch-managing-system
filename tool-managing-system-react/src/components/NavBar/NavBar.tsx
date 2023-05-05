import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <Link to="/">홈</Link>
      <Link to="/sign-in">로그인</Link>
    </div>
  );
}
