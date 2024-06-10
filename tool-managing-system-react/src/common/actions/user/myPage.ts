import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type MyPageInput = {
  username: string;
};

export type MyPageOutput = {
  username: string;
  userRole: string;
  passwordSetDate: string;
  passwordValidUntil: string;
};

export const createMyPage = async (
  input: MyPageInput
): Promise<MyPageOutput> => {
  let output: unknown;

  try {
    output = await request.post(
      `/api/tool-managing-system/users/my_page`,
      input
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("==user가 존재 하지 않습니다.==");
      }
    }
    throw new Error("==알 수 없는 오류가 발생했습니다.==");
  }

  return output as MyPageOutput;
};
