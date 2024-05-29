import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type ResetPasswordInput = {
  username: string;
  newPassword: string;
};

export type ResetPasswordOutput = {
  success: Record<string, string>;
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
      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("==user가 존재 하지 않습니다.==");
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw new Error("==user is not authorized for this request==");
      }
    }
    throw new Error("==알 수 없는 오류가 발생했습니다.==");
  }

  return output as ResetPasswordOutput;
};
