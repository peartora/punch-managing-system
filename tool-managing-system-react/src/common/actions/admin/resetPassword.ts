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
        throw new Error("==user가 존재 하지 않습니다.==");
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw new Error("==user is not authorized for this request==");
      } else if (error.code === "USER_PASSWORD_SHORT") {
        throw new Error("==password is short==");
      } else {
        throw new Error("==알 수 없는 오류가 발생했습니다.==");
      }
    }
    console.log("if state exited");

    throw new Error("==알 수 없는 오류가 발생했습니다.==");
  }

  return output as ResetPasswordOutput;
};
