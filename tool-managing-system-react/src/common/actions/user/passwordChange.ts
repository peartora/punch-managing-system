import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type PasswordChangeInput = {
  username: string;
  password: string;
  passwordConfirmation?: string;
};

export type PasswordChangeOutput = {
  username: string;
};

export const passwordChange = async function (input: PasswordChangeInput) {
  let output;

  try {
    output = await request.post(
      "/api/tool-managing-system/users/passwordChange",
      input
    );
  } catch (error) {
    if (error.code === "USER_PASSWORD_NOT_SAME") {
      throw new Error("==입력 된 2개의 비밀번호가 다릅니다.==");
    } else if (error.code === "USER_PASSWORD_SHORT") {
      throw new Error("==입력 된 비밀번호가 6자리 미만 입니다.==");
    } else if (error.code === "USER_IS_NOT_EXIST") {
      throw new Error("==해당 user Id가 존재 하지 않습니다.==");
    } else if (error.code === "NEW_PASSWORD_SAME_WITH_CURRENT_PASSWORD") {
      throw new Error("==신규 비밀번호가 기존 비밀번호와 동일 합니다.==");
    } else {
      throw new Error("==알 수 없는 오류가 발생했습니다.==");
    }
  }
  return output;
};
