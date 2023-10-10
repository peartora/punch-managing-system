import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { request } from "@/common/utils/ajax";

type Data = {
  result: string;
  username: string;
  currentPassword: string;
};

export function ChangePassword({ result, username, currentPassword }: Data) {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordForConfirmation, setNewPasswordForConfirmation] =
    useState("");

  const navigate = useNavigate();

  const submitHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword && newPasswordForConfirmation) {
      if (newPassword === newPasswordForConfirmation) {
        if (newPassword !== currentPassword) {
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
                navigate(`/sign-in`);
              } else if (result === "NOK") {
                alert(
                  `${username}의 비밀번호 변경 중 error가 발생 하였습니다.`
                );
              }
            })
            .catch((error) => console.error(error));
        } else {
          alert(
            `입력하신 신규 비밀번호가 과거 비밀번호와 동일 합니다. 신규 비밀번호를 변경 하세요`
          );
        }
      } else {
        alert(`1차 입력 비밀번호와 2차 입력 비밀번호가 다릅니다.`);
      }
    }
  };

  return result ? (
    <form style={{ marginTop: "30px" }} onSubmit={submitHandler}>
      <div>
        <label>
          {username}의 변경할 비밀번호를 입력 하세요.
          <input
            className="form-control"
            type="text"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          비밀번호를 한번 더 입력 하세요.
          <input
            className="form-control"
            type="text"
            onChange={(e) => setNewPasswordForConfirmation(e.target.value)}
          />
        </label>
      </div>
      <button
        className="btn btn-primary"
        style={{ marginTop: "30px" }}
        type="submit"
      >
        password 변경
      </button>
    </form>
  ) : (
    <div>id에 맞는 비밀번호를 입력 하면 비밀번호 변경 창으로 변경 됩니다.</div>
  );
}
