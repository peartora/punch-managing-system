import { BusinessError } from "./../../error";
import { request } from "./../../utils/ajax";

export type LoginUserInput = {
  username: string;
  password: string;
};

export type LoginUserOutput = {
  success: Record<string, string>;
};

export const loginUser = async (
  input: LoginUserInput
): Promise<LoginUserOutput> => {
  let output;

  try {
    output = await request.post(`/api/tool-managing-system/users/login`, input);
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("==존재하지 않는 id 입니다.==");
      } else if (error.code === "USER_IS_NOT_APPROVED") {
        throw new Error("==미승인 된 유저 입니다.==");
      } else if (error.code === "USER_IS_LOCKED") {
        throw new Error("==잠긴 계정 입니다.==");
      } else if (error.code === "PUSER_PASSWORD_NOT_SAME") {
        throw new Error("==비밀번호가 일치하지 않습니다.==");
      } else if (error.code === "USER_IS_EXPIRED") {
        throw new Error("==계정이 만료 되었습니다.==");
      }
    }
    throw new Error("==알 수 없는 오류가 발생했습니다.==");
  }

  return output as LoginUserOutput;
};
