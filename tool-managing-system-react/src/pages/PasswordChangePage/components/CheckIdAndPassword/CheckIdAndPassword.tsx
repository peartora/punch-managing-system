import { useState } from "react";

import { request } from "@/common/utils/ajax";

import { ChangePassword } from "./components/ChangePassword";

export function CheckIdAndPassword() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [resultForId, setResultForId] = useState("");

  const checkUserNameHandler = function () {
    const body = {
      username,
      password: currentPassword,
    };
    request
      .post(`/api/tool-managing-system/usercheck`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `현재 id, password 확인 통신 중 error 발생 하였습니다.`
          );
        }
        return response.text();
      })
      .then((result) => {
        if (result === "NoId") {
          alert(`${username} id가 존재 하지 않습니다.`);
        } else if (result === "OK") {
          alert(`${username} id의 비밀번호 변경 화면으로 이동 합니다.`);
          setResultForId("OK");
        } else if (result === "NOK") {
          alert(`입력 하신 비밀번호가 일치 하지 않습니다.`);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form onSubmit={checkUserNameHandler}>
        <div>
          <label>
            비밀번호 변경 하고자 하는 Id:
            <input
              className="form-control"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            현재 비밀번호:
            <input
              className="form-control"
              type="text"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">userId, password 확인</button>
      </form>

      <ChangePassword result={resultForId} username={username} />
    </div>
  );
}
