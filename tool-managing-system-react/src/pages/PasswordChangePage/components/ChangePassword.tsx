import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  PasswordChangeInput,
  passwordChange,
} from "@/common/actions/user/passwordChange";

export function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordForConfirmation, setNewPasswordForConfirmation] =
    useState("");

  const navigate = useNavigate();

  const username = sessionStorage.getItem("tool-managing-system-current-user");

  const submitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (newPassword !== newPasswordForConfirmation) {
      alert(`입력된 2개의 비밀번호가 다릅니다.`);
      return;
    }

    if (newPassword.length < 6) {
      alert(`비밀번호는 6자리 이상 되어야 합니다.`);
      return;
    }

    const body: PasswordChangeInput = {
      username,
      newPassword,
      newPasswordForConfirmation,
    };

    console.log("body", body);

    let output;

    try {
      output = await passwordChange(body);
    } catch (error) {
      alert(`${error.message}`);
      return;
    }

    alert(`${username}의 비밀번호가 변경 되었습니다.`);
    navigate("/mypage");
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
