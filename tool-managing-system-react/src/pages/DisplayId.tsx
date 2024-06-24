import { useState } from "react";

import { approveId } from "@/common/actions/admin/approveId";

import { User } from "@/common/hooks/useFetchUserList";
import { deleteUser } from "@/common/actions/admin/deleteId";
import { BusinessError } from "@/common/error";
import {
  ResetPasswordInput,
  resetPassword,
} from "@/common/actions/admin/resetPassword";

type UserReftch = () => void;

type IdProps = {
  user: User;
  loginUser: string;
  refetchForUserList: UserReftch;
};

export function DisplayId({ user, loginUser, refetchForUserList }: IdProps) {
  const { notLocked, approved: isApproved } = user;
  const [newPassword, setNewPassword] = useState("");

  const changeHandler = function (e: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(e.target.value);
  };

  const resetPasswordHandler = async function (
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    // if (newPassword.length < 6) {
    //   alert("비밀번호는 6자 이상으로 설정 되어야 합니다.");
    //   return;
    // }

    const body: ResetPasswordInput = {
      username: user.username,
      loginUsername: loginUser,
      newPassword: newPassword,
    };

    let output;

    try {
      output = await resetPassword(body);
    } catch (error) {
      alert(error.message);
      return;
    }

    refetchForUserList();
    alert(`${output} id의 비밀번호가 초기화 되었습니다.`);
  };

  const approveUserHandler = async function (
    e: React.MouseEvent<HTMLButtonElement>
  ) {
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
    alert(`${output} 이/가 승인 되었습니다.`);
  };

  const deleteUserHandler = async function () {
    const candidateId = user.username;

    const body = {
      username: candidateId,
      loginUsername: loginUser,
    };

    let output;

    try {
      output = await deleteUser(body);
    } catch (error) {
      if (error instanceof BusinessError) {
        alert(error.message);
        return;
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
          <form onSubmit={resetPasswordHandler}>
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
