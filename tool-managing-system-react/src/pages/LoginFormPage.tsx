import { useState } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "@/common/contexts/auth";
import { request } from "@/common/utils/ajax";

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
      .post(`/api/tool-managing-system/login`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`회원가입 중 network error 발생 하였습니다.`);
        }
        return response.json();
      })
      .then((json) => {
        if (json.login == true) {
          console.log("login true");
          login(username);
        } else {
          if (!json.approved) {
            alert(
              `Id: ${json.username} 은(는) 미승인 상태 입니다. 관리자에게 문의 하세요.`
            );
          } else if (!json.notLocked) {
            alert(
              `Id: ${json.username} 은(는) 잠김 상태 입니다. 관리자에게 문의 하세요.`
            );
          } else if (!json.notExpired) {
            alert(
              `Id: ${json.username} 은(는) 비밀번호 유효기간이 만료 되었습니다. 비밀번호를 변경 하세요.`
            );
          } else if (!json.passwordCorrect) {
            alert(
              `Id: ${json.username}의 비밀번호가 ${json.loginTrialCount}회 틀렸습니다.(5회이상 틀리면 계정이 잠깁니다.)`
            );
          }
        }
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
            type="password"
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
    </div>
  );
};
