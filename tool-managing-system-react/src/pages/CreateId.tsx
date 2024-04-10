import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { request } from "@/common/utils/ajax";

export function CreateId() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const submitHandler = function (e: React.FormEvent) {
    e.preventDefault();

    if (password === passwordConfirmation) {
      if (password.length >= 6) {
        const body = {
          username,
          password,
          passwordConfirmation,
          role,
        };

        request
          .post(`/api/tool-managing-system/register_user`, body)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`회원가입 중 network error 발생 하였습니다.`);
            }
            return response.json();
          })
          .then((json) => {
            if (json.registered) {
              alert(`Id: ${json.username}이(가) 등록 되었습니다.`);
              navigate(`/sign-in`);
            } else {
              if (json.duplicate) {
                alert(`Id: ${json.username}은(는) 이미 등록 되었습니다.`);
              } else if (!json.passwordLongEnough) {
                alert(
                  `Id: ${json.username}의 비밀번호는 6자 이상으로 설정 되어야 합니다.`
                );
              } else if (!json.passwordSameWithConfirmation) {
                alert(
                  `Id: ${json.username}의 입력 된 비밀번호 2개가 일치 하지 않습니다.`
                );
              }
            }
          });
      } else {
        alert("비밀번호는 6자 이상으로 설정 되어야 합니다.");
      }
    } else {
      alert("입력 된 비밀번호 2개가 일치 하지 않습니다.");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div style={{ marginTop: "20px" }}>
        <label>
          생성할 ID 입력:
          <input
            className="form-control"
            type="string"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          비밀번호 입력:
          <input
            className="form-control"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          비밀번호 재입력:
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          역할:
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              아래 list에서 역할을 선택 하세요
            </option>
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </label>
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: "30px" }}
        type="submit"
      >
        계정등록
      </button>
    </form>
  );
}
