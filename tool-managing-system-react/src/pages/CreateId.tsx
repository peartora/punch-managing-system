import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { request } from "@/common/utils/ajax";

export function CreateId() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  const submitHandler = function (e: React.FormEvent) {
    e.preventDefault();

    if (password === passwordConfirmation) {
      if (password.length >= 4) {
        const body = {
          id,
        };

        request
          .post(`/api/tool-managing-system/duplicate_username`, body)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`${id}의 중복 확인 중 error 발생 하였습니다.`);
            }
            return response.text();
          })
          .then((result) => {
            if (result === "OK") {
              const body = {
                id,
                password,
              };

              request
                .post(`/api/tool-managing-system/create_id`, body)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(
                      `회원가입 중 network error 발생 하였습니다.`
                    );
                  }
                  return response.text();
                })
                .then((result) => {
                  if (result === "OK") {
                    alert(`${id}의 회원가입이 완료 되었습니다.`);
                    navigate(`/sign-in`);
                  } else {
                    alert(`${id}의 회원가입 중 error가 발생 하였습니다.`);
                  }
                })
                .catch((error) => console.error(error));
            } else {
              alert(`${id}는 이미 존재 하는 id 입니다.`);
            }
          });
      } else {
        alert(`password의 길이는 최소 4자리 이상 입니다.`);
      }
    } else {
      alert(`입력한 2개의 비밀번호가 일치 하지 않습니다.`);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label>
          생성할 ID 입력:
          <input
            className="form-control"
            type="string"
            onChange={(e) => setId(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          비밀번호 입력:
          <input
            className="form-control"
            type="string"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          비밀번호 재입력:
          <input
            type="string"
            className="form-control"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
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
