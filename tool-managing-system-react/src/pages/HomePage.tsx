import { useAuth } from "@/common/auth";
import NavBar from "@/components/NavBar";
import SearchForm from "@/components/formElement/SearchForm";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <NavBar />

      <div>
        혼재 로그인 유저: {user},{" "}
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
