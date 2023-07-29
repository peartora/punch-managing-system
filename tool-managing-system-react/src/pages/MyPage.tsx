import { useAuth } from "@/common/auth";
import NavBar from "@/components/NavBar";

export const MyPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <NavBar />
      <h3>{user} id로 로그인 되었습니다.</h3>
      <div>
        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </div>

      <div>
        <h3>비밀번호 변경</h3>
        <form action="#">어쩌구</form>
      </div>
    </div>
  );
};
