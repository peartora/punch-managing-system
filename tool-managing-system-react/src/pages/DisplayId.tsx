import { useState } from "react";

import { request } from "@/common/utils/ajax";

type Id = {
  username: string;
  role: string;
  is_locked: boolean;
  is_approved: boolean;
};

type SetIdList = (newIdList: Id[]) => void;

type IdList = Id[];

type IdProps = {
  id: Id;
  idList: IdList;
  setIdList: SetIdList;
};

export function DisplayId({ id, idList, setIdList }: IdProps) {
  const [isLocked, setIsLocked] = useState(() => id.is_locked);
  const [isApproved, setIsApproved] = useState(() => id.is_approved);
  const [newPassword, setNewPassword] = useState("");

  const changeHandler = function (e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
  };

  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword.length >= 6) {
      const resetId = id.username;

      const body = {
        username: resetId,
        password: newPassword,
        isLocked: false,
        trialCount: 0,
      };

      request
        .post(`/api/tool-managing-system/resetPassword`, body)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `${resetId} 계정의 잠금상태 초기화 중 error 발생 하였습니다.`
            );
          }
          return response.text();
        })
        .then((result) => {
          if (result === "OK") {
            setIsLocked(false);
            alert(`${resetId} 계정의 초기화가 완료 되었습니다.`);
          } else if (result === "NOK_PasswordSame") {
            alert(
              `${resetId} 계정의 입력 된 비밀번호가 과거 비밀번호와 동일 합니다.`
            );
          } else {
            alert(`${resetId} 계정의 초기화 중 error가 발생 하였습니다.`);
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert(`password의 길이는 최소 6자리 이상 입니다.`);
    }
  };

  const clickHandler = function (e: React.MouseEvent<HTMLButtonElement>) {
    const body = {
      username: id.username,
      isApprove: true,
    };

    request
      .post(`/api/tool-managing-system/approveId`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${id.username} 계정 승인 중 error 발생 하였습니다.`);
        }
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          setIsApproved(true);
          alert(`${id.username} 계정이 승인 되었습니다.`);
        } else {
          alert(`${id.username} 계정 승인 중 error가 발생 하였습니다.`);
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteUser = function () {
    const candidateId = id.username;

    const body = {
      username: candidateId,
    };

    request
      .post(`/api/tool-managing-system/delete_user`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${id.username} 계정 삭제 중 error 발생 하였습니다.`);
        }
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          const newIdList = idList.filter((id) => id.username !== candidateId);
          setIdList(newIdList);
          alert(`${candidateId} 계정이 삭제 되었습니다.`);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <tr>
      <td>{id.username}</td>
      <td>{id.role}</td>

      {isLocked ? <td>비활성화</td> : <td>활성화</td>}
      {isLocked ? (
        <td>
          <form onSubmit={submitHandler}>
            <label>
              초기화 시킬 비밀번호를 입력 하세요:
              <input type="password" onChange={changeHandler} />
            </label>
            <button type="submit">초기화!</button>
          </form>
        </td>
      ) : (
        <td>해당없음</td>
      )}

      {!isApproved ? <td>미승인</td> : <td>승인</td>}
      {!isApproved ? (
        <td>
          <button onClick={clickHandler}>승인!</button>
        </td>
      ) : (
        <td>해당없음</td>
      )}
      <td>
        <button onClick={deleteUser}>삭제!</button>
      </td>
    </tr>
  );
}
