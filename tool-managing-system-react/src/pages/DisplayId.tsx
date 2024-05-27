import { useState } from "react";

import { request } from "@/common/utils/ajax";

type Id = {
  userId: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
  notExpired: boolean;
  createdDate: string;
};

type SetIdList = (newIdList: Id[]) => void;

type IdList = Id[];

type IdProps = {
  id: Id;
  idList: IdList;
  setIdList: SetIdList;
};

export function DisplayId({ id, idList, setIdList }: IdProps) {
  const [notLocked, setNotLocked] = useState(() => id.notLocked);
  const [isApproved, setIsApproved] = useState(() => id.approved);
  const [newPassword, setNewPassword] = useState("");

  const changeHandler = function (e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
  };

  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword.length >= 6) {
      const resetId = id.userId;

      const body = {
        username: resetId,
        password: newPassword,
      };

      request
        .post(`/api/tool-managing-system/resetPassword`, body)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `${resetId} 계정의 잠금상태 초기화 중 error 발생 하였습니다.`
            );
          }
          return response.json();
        })
        .then((json) => {
          console.log("json");
          console.log(json);

          if (json.passwordReset) {
            alert(`초기화 되었습니다.`);
            setNotLocked(true);
          } else if (!json.passwordLongEnough) {
            alert(`입력된 비밀번호의 길이가 6자리 미만 입니다.`);
          } else if (!json.passwordSameWithCurrentPassword) {
            alert(`입력된 비밀번호가 현재 비밀번호와 동일 합니다.`);
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert(`password의 길이는 최소 6자리 이상 입니다.`);
    }
  };

  const clickHandler = function (e: React.MouseEvent<HTMLButtonElement>) {
    const body = {
      username: id.userId,
      isApprove: true,
    };

    request
      .post(`/api/tool-managing-system/approveId`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${id.userId} 계정 승인 중 error 발생 하였습니다.`);
        }
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          setIsApproved(true);
          alert(`${id.userId} 계정이 승인 되었습니다.`);
        } else {
          alert(`${id.userId} 계정 승인 중 error가 발생 하였습니다.`);
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteUser = function () {
    const candidateId = id.userId;

    const body = {
      username: candidateId,
    };

    request
      .post(`/api/tool-managing-system/delete_user`, body)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${id.userId} 계정 삭제 중 error 발생 하였습니다.`);
        }
        return response.text();
      })
      .then((result) => {
        if (result === "OK") {
          const newIdList = idList.filter((id) => id.userId !== candidateId);
          setIdList(newIdList);
          alert(`${candidateId} 계정이 삭제 되었습니다.`);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <tr>
      <td>{id.userId}</td>
      <td>{id.userRole}</td>

      {!notLocked ? <td>비활성화</td> : <td>활성화</td>}
      {!notLocked ? (
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
