import { useState } from "react";

import { Link } from "react-router-dom";

import { request } from "@/common/utils/ajax";
import { useAuth } from "@/common/contexts/auth";

export const LoginFormPage = () => {
  const { login } = useAuth();

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          id:{" "}
          <input
            style={{ width: "300px" }}
            className="form-control"
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
            style={{ width: "300px" }}
            className="form-control"
            name="password"
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ marginTop: "30px", marginBottom: "30px" }}
          >
            로그인
          </button>
        </div>
      </form>

      <Link to="/password-change" style={{ marginRight: "20px" }}>
        비밀번호 변경
      </Link>
      <Link to="/create-id">회원가입</Link>

      {!isLogIned && isIdExists && (
        <h5>비밀번호가 다릅니다. 다시 확인 하세요</h5>
      )}
      {!isIdExists && !isIdExists && (
        <h5>id를 찾을 수 없습니다. 다시 확인 하세요</h5>
      )}
    </div>
  );
};
