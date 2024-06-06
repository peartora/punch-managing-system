import { useState } from "react";

import { request } from "@/common/utils/ajax";

import { approveId } from "@/common/actions/admin/approveId";

import { User } from "@/common/hooks/useFetchUserList";
import { deleteUser } from "@/common/actions/admin/deleteId";
import { BusinessError } from "@/common/error";

type UserReftch = () => void;

type UserList = User[];

type IdProps = {
  user: User;
  userList: UserList;
  refetchForUserList: UserReftch;
};

export function DisplayId({ user, userList, refetchForUserList }: IdProps) {
  const { notLocked, approved: isApproved } = user;
  const [newPassword, setNewPassword] = useState("");

  const changeHandler = function (e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
  };

  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newPassword.length >= 6) {
      const resetId = user.username;

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
            refetchForUserList();
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

  const approveUserHandler = async function (
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    console.log(`** clickHandler in DisplayId called`);

    const body = {
      username: user.username,
    };

    let output;

    try {
      output = await approveId(body);
    } catch (error) {
      alert(error.message);
      return;
    }

    refetchForUserList();
    alert(`${output.success.data.username} 이/가 승인 되었습니다.`);
  };

  const deleteUserHandler = async function () {
    const candidateId = user.username;

    const body = {
      username: candidateId,
    };

    let output;

    try {
      output = await deleteUser(body);
    } catch (error) {
      if (error instanceof BusinessError) {
        alert(error.message);
      }
    }
    refetchForUserList();
    alert(`${output} 은/는 삭제 되었습니다.`);
  };

  return (
    <tr>
      <td>{user.username}</td>
      <td>{user.userRole}</td>

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
          <button onClick={approveUserHandler}>승인!</button>
        </td>
      ) : (
        <td>해당없음</td>
      )}
      <td>
        <button onClick={deleteUserHandler}>삭제!</button>
      </td>
    </tr>
  );
}
