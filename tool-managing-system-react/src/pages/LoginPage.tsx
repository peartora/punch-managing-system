import { useState } from "react";
import { request } from "@/common/Service";

import { useAuth } from "@/common/auth";
import NavBar from "@/components/NavBar";
import NavBarForId from "@/components/NavBarForId";

// username을 받아와서, 있으면 login 상태를 표시 하는 로직.

export const LoginPage = () => {
  const { user, login, logout } = useAuth();

  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogIned, setIsLogIned] = useState<boolean>(true);
  const [isIdExists, setIsIdExists] = useState<boolean>(true);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const body = {
      username,
      password,
    };

    request
      .post(`/api/tool-managing-system/usercheck`, body)
      .then((response) => {
        if (!response.ok)
          throw new Error(`유저 정보를 확인 하는 중 error가 발생 하였습니다.`);
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          console.log(`result is ok`);
          login(username);
        } else {
          setIsLogIned(false);

          if (result === "NoId") {
            setIsIdExists(false);
          } else if (result === "NOK") {
            setIsIdExists(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (user) {
    return (
      <>
        <NavBar />
        <h3>{user} id로 로그인 되었습니다.</h3>
        <div>
          <button type="button" onClick={logout}>
            로그아웃
          </button>
        </div>
      </>
    );
  }

  return (
    <div>
      {/* <NavBarForId /> */}
      <form onSubmit={handleSubmit}>
        <div>
          id:{" "}
          <input
            name="username"
            type="text"
            value={username}
            required
            onChange={(event) => setUserName(event.target.value)}
          />
        </div>
        <div>
          password:{" "}
          <input
            name="password"
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">로그인</button>
        </div>
      </form>
      {!isLogIned && isIdExists && (
        <h5>비밀번호가 다릅니다. 다시 확인 하세요</h5>
      )}
      {!isIdExists && !isIdExists && (
        <h5>id를 찾을 수 없습니다. 다시 확인 하세요</h5>
      )}
    </div>
  );
};
