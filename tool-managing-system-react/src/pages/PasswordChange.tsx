import { useState } from "react";

import { request } from "@/common/Service";

export default function PasswordChange() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [resultForId, setResultForId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordForConfirmation, setNewPasswordForConfirmation] =
    useState("");

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
          alert(`입력 하신 ${username} id가 존재 하지 않습니다.`);
        } else if (result === "OK") {
          setResultForId("OK");
        } else if (result === "NOK") {
          alert(`입력 하신 비밀번호가 일치 하지 않습니다.`);
        }
      });
  };

  const passwordChangeHandler = function () {
    if (
      (newPassword !== "" || newPassword === null) &&
      (newPasswordForConfirmation !== "" || newPasswordForConfirmation === null)
    ) {
      if (newPassword === newPasswordForConfirmation) {
        const body = {
          username,
          newPassword,
        };

        request
          .post(`/api/tool-managing-system/password_change`, body)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`비밀번호 변경 중 통신 error 발생 하였습니다.`);
            }
            return response.text();
          })
          .then((result) => {
            if (result === "OK") {
              alert(`${username}의 비밀번호가 변경 되었습니다.`);
            }
          })
          .catch((error) => console.error(error));
      } else {
        alert(`1차 입력 비밀번호와 2차 입력 비밀번호가 다릅니다.`);
        return;
      }
    }
  };

  if (resultForId === "OK") {
    return (
      <form onSubmit={passwordChangeHandler}>
        <label>{username}의 변경할 비밀번호를 입력 하세요.</label>
        <input type="text" onChange={(e) => setNewPassword(e.target.value)} />
        <input
          type="text"
          onChange={(e) => setNewPasswordForConfirmation(e.target.value)}
        />
        <button type="submit">password 변경</button>
      </form>
    );
  }

  return (
    <form onSubmit={checkUserNameHandler}>
      <label>
        비밀번호 변경 하고자 하는 Id:
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        현재 비밀번호:
        <input
          type="text"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </label>
      <button type="submit">userId, password 확인</button>
    </form>
  );
}
