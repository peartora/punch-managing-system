import { useState } from "react";

import { Link } from "react-router-dom";

import { request } from "@/common/utils/ajax";
import { useAuth } from "@/common/contexts/auth";

export const LoginFormPage = () => {
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
        } else {
          if (result === "NoId") {
            alert(`${username} 계정은 등록 되지 않은 계정 입니다.`);
          } else {
            if (result === "NOK") {
              alert(
                `${username} 계정의 비밀번호가 다릅니다.(5회 이상 틀리면 계정이 잠금으로 바뀝니다.)`
              );
            } else {
              alert(
                `${username} 계정의 비밀번호가 5회 틀렸습니다. 계정이 잠겼습니다. 관리자에게 문의 하세요`
              );
            }
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
      <Link to="/create-id">계정등록</Link>

      {/* {!isLogIned && isIdExists && (
        <h5>비밀번호가 다릅니다. 다시 확인 하세요</h5>
      )}
      {!isIdExists && !isIdExists && (
        <h5>id를 찾을 수 없습니다. 다시 확인 하세요</h5>
      )}
      {isIdLocked && (
        <h5>
          id가 비밀번호 오류 횟 수 초과로 잠금상태가 되었습니다. 관리자에게 문의
          하세요
        </h5>
      )} */}
    </div>
  );
};
