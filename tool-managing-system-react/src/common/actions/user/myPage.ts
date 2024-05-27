import { BusinessError } from "./../../error";
import { request } from "./../../utils/ajax";

export type MyPageInput = {
  username: string;
};

export type MyPageOutput = {
  success: Record<string, string>;
};

export const createMyPage = async (
  input: MyPageInput
): Promise<MyPageOutput> => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/users/my_page`,
      input
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_APPROVED") {
        throw new Error("==미승인 상태 입니다.==");
      } else if (error.code === "USER_IS_LOCKED") {
        throw new Error("==현재 잠금 상태 입니다.==");
      } else if (error.code === "USER_IS_EXPIRED") {
        throw new Error("==비밀번호가 만료 되었습니다.==");
      } else if (error.code === "USER_PASSWORD_NOT_SAME") {
        throw new Error("==비밀번호가 일치하지 않습니다.==");
      }
    }
    throw new Error("==알 수 없는 오류가 발생했습니다.==");
  }

  return output as MyPageOutput;
};
