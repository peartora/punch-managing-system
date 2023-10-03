import { useState } from "react";

import { Link } from "react-router-dom";

import { request } from "@/common/utils/ajax";
import { useAuth } from "@/common/contexts/auth";

import dayjs from "dayjs";

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
          const query = new URLSearchParams();
          query.append("username", username);

          request
            .get(`/api/tool-managing-system/created-date?${query}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `비밀번호 최근 변경 이력 조회 중 network error 발생 하였습니다.`
                );
              }
              return response.text();
            })
            .then((result) => {
              const today = dayjs();
              const initialDate = dayjs(result);

              const isWithinTwoMonths = initialDate.isAfter(
                today.subtract(8, "month")
              );

              if (isWithinTwoMonths) {
                login(username);
              } else {
                alert(
                  `id 최초 가입 혹은 가장 최근 비밀번호 변경일로 부터 2달이 지났습니다. 비밀번호 변경을 먼저 하세요`
                );
              }
            });
        } else {
          if (result === "NoId") {
            alert(`${username} 계정은 등록 되지 않은 계정 입니다.`);
          } else if (result === "NotYetApproved") {
            alert(`${username} 계정은 승인 대기중 입니다.`);
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
    </div>
  );
};
