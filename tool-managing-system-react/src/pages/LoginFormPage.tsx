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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "400px", textAlign: "center" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label htmlFor="username">Id: </label>
            <input
              id="username"
              style={{ width: "100%" }}
              className="form-control"
              name="username"
              type="text"
              value={username}
              required
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              style={{ width: "100%" }}
              className="form-control"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginTop: "30px", marginBottom: "30px" }}
            >
              로그인
            </button>
          </div>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link
            to="/password-change-before-login"
            style={{ marginRight: "20px" }}
          >
            비밀번호 변경
          </Link>
          <Link to="/create-id">계정등록</Link>
        </div>
      </div>
    </div>
  );
};
