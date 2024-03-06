import { useState } from "react";

import { Link } from "react-router-dom";

import { useAuth } from "@/common/contexts/auth";

import { checkUser } from "@/common/utils/checkUser";

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

    checkUser(body)
      .then((result) => {
        if (result === "OK") {
          login(username);
        } else {
          if (result === "NoId") {
            alert(`ID: ${username}은(는) 등록 되지 않았습니다.`);
          } else if (result === "NotYetApproved") {
            alert(`ID: ${username}은(는) 미승인 상태 입니다.`);
          } else if (result === "Locked") {
            alert(`ID: ${username}은(는) 잠금 상태 입니다.`);
          } else if (result === "Expired") {
            alert(`ID: ${username}의 비밀번호가 만료 되었습니다.`);
          } else if (result.startsWith("NOK")) {
            const resultArray = result.split(",");
            const trialCount = parseInt(resultArray[1], 10);

            if (trialCount >= 5) {
              `${username} 계정의 비밀번호가 5회 틀렸습니다. 계정이 잠겼습니다.(관리자에게 문의 하세요)`;
            } else {
              `${username} 계정의 비밀번호가 ${trialCount}회 틀렸습니다.(5회 이상 틀리면 계정이 잠금으로 바뀝니다.)`;
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
