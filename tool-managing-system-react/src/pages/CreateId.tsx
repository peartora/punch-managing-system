import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  addUser,
  type AddUserInput,
  type AddUserOutput,
} from "@/common/actions/user/addUser";

export function CreateId() {
  const [username, setUsername] = useState<AddUserInput["username"]>("");
  const [password, setPassword] = useState<AddUserInput["password"]>("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState<AddUserInput["passwordConfirmation"]>("");
  const [role, setRole] = useState<AddUserInput["role"]>("");

  const navigate = useNavigate();

  const submitHandler = async function (e: React.FormEvent) {
    e.preventDefault();

    //if (password !== passwordConfirmation) {
    //alert("입력 된 비밀번호 2개가 일치 하지 않습니다.");
    //return;
    //}

    //if (password.length < 6) {
    //  alert("비밀번호는 6자 이상으로 설정 되어야 합니다.");
    //  return;
    //}

    const input: AddUserInput = {
      username,
      password,
      passwordConfirmation,
      role,
    };

    let output: AddUserOutput;

    try {
      output = await addUser(input);
    } catch (error) {
      alert(error.message);
      return;
    }

    console.log(`output`, output);

    alert(`Id: ${output}이(가) 등록 되었습니다.`);
    navigate(`/sign-in`);
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
