import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

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
        throw new Error("존재하지 않는 User 입니다.");
      } else if (error.code === "USER_IS_NOT_APPROVED") {
        throw new Error("미승인 된 유저 입니다. 관리자에게 문의 하세요.");
      } else if (error.code === "USER_IS_LOCKED") {
        throw new Error(
          "비밀번호 5회 이상 틀려서 계정이 잠겼습니다. 관리자에게 문의 하세요."
        );
      } else if (error.code === "LOGIN_PASSWORD_IS_NOT_CORRECT") {
        throw new Error(
          "비밀번호가 틀렸습니다. 5회 이상 틀릴 경우 계정이 잠깁니다."
        );
      } else if (error.code === "USER_IS_EXPIRED") {
        throw new Error(
          "비밀번호 기한 만료로 계정이 잠겼습니다. 비밀번호를 변경하세요."
        );
      } else if (error.code === "RESOURCE_NOT_FOUND") {
        throw new Error("자원이 없습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output as LoginUserOutput;
};
