import { useState } from "react";
import { request } from "@/common/Service";

import { useAuth } from "@/common/auth";

export const LoginPage = () => {
  const { login } = useAuth();

  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
          login(username);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
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
    </div>
  );
};
