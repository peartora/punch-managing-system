import { useState } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "@/common/contexts/auth";

import {
  loginUser,
  type LoginUserInput,
  type LoginUserOutput,
} from "@/common/actions/user/loginUser";

export const LoginFormPage = () => {
  const { login } = useAuth();

  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const body: LoginUserInput = {
      username,
      password,
    };

    let output: LoginUserOutput;

    try {
      output = await loginUser(body);
      console.log("In try");
      console.log("output", output);
    } catch (error) {
      console.log("In catch");

      alert(error.message);
      return;
    }

    console.log(`output`, output);

    login(username);
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
