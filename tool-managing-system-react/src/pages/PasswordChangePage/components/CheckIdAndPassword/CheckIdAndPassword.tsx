import { useState } from "react";
import { ChangePassword } from "./components/ChangePassword";
import { checkUser } from "./../../../../common/utils/checkUser";

export function CheckIdAndPassword() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [resultForId, setResultForId] = useState("");

  const checkUserNameHandler = function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const body = {
      username,
      password: currentPassword,
    };

    checkUser(body, {
      OK: () => {
        alert(`${username} id의 비밀번호 변경 화면으로 이동 합니다.`);
        setResultForId("OK");
      },
      NOK: () => {
        alert(`입력 된 비밀번호가 틀렸습니다.`);
      },
    }).catch((error) => console.error(error));
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
              type="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "30px", marginBottom: "30px" }}
        >
          userId, password 확인
        </button>
      </form>

      <ChangePassword
        result={resultForId}
        username={username}
        currentPassword={currentPassword}
      />
    </div>
  );
}
