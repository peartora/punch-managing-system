import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type ResetPasswordInput = {
  username: string;
  loginUsername: string;
  newPassword: string;
};

export type ResetPasswordOutput = {
  username: string;
};

export const resetPassword = async (
  input: ResetPasswordInput
): Promise<ResetPasswordOutput> => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/admin/resetPassword`,
      input
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      console.log("Yes I am here");

      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("User가 존재 하지 않습니다.");
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw new Error("비밀번호를 reset 할 권한이 없습니다.");
      } else if (error.code === "USER_PASSWORD_SHORT") {
        throw new Error("비밀번호는 6자리 이상 되어야 합니다.");
      } else if (error.code === "NEW_PASSWORD_SAME_WITH_CURRENT_PASSWORD") {
        throw new Error("신규 비밀번호는 기존 비밀번호와 달라야 합니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output as ResetPasswordOutput;
};
