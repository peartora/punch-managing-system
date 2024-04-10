import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { request } from "@/common/utils/ajax";

export function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordForConfirmation, setNewPasswordForConfirmation] =
    useState("");

  const navigate = useNavigate();

  const username = sessionStorage.getItem("tool-managing-system-current-user");

  const submitHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword && newPasswordForConfirmation) {
      if (newPassword === newPasswordForConfirmation) {
        if (newPassword.length >= 6) {
          const body = {
            username,
            newPassword,
            newPasswordForConfirmation,
          };

          request
            .post(`/api/tool-managing-system/password_change`, body)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`비밀번호 변경 중 통신 error 발생 하였습니다.`);
              }
              return response.json();
            })
            .then((json) => {
              if (json.passwordChanged) {
                navigate("/mypage");
                alert(`${username}의 비밀번호가 변경 되었습니다.`);
              } else {
                if (!json.newPasswordLonghEnough) {
                  alert(`입력된 비밀번호가 6자리 미만 입니다.`);
                } else if (!json.newPasswordDifferentWithCurrentPassword) {
                  alert(`신규 비밀번호가 현재의 비밀번호와 동일 합니다.`);
                } else if (!json.newPasswordSameWithNewPasswordConfirmation) {
                  alert(`입력된 2개의 비밀번호가 다릅니다.`);
                }
              }
            })
            .catch((error) => console.error(error));
        } else {
          alert(`password의 길이는 최소 6자리 이상 입니다.`);
        }
      } else {
        alert(`1차 입력 비밀번호와 2차 입력 비밀번호가 다릅니다.`);
      }
    }
  };

  return (
    <form style={{ marginTop: "30px" }} onSubmit={submitHandler}>
      <div>
        <label>
          Id: {username}의 변경할 비밀번호를 6자 이상 입력 하세요.
          <input
            className="form-control"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          비밀번호를 한번 더 입력 하세요.
          <input
            className="form-control"
            type="password"
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
  );
}
