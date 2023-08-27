import { useAuth } from "@/common/auth";
import NavBar from "@/components/NavBar";

import { SearchForm } from "./components/SearchForm";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <NavBar />

      <div>
        현재 로그인 유저: {user},{" "}
        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </div>

      <br />
      <br />

      <SearchForm />
    </main>
  );
}