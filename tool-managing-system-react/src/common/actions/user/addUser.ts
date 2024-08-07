import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type AddUserInput = {
  username: string;
  password: string;
  passwordConfirmation: string;
  role: string;
};

export type AddUserOutput = {
  success: Record<string, string>;
};

export const addUser = async (input: AddUserInput): Promise<AddUserOutput> => {
  let output;

  try {
    output = await request.post(`/api/tool-managing-system/users`, input);
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_USERNAME_DUPLICATED") {
        throw new Error("해당 User는 이미 등록 되었습니다.");
      } else if (error.code === "USER_PASSWORD_SHORT") {
        throw new Error("비밀번호는 6자리 이상 되어야 합니다.");
      } else if (error.code === "USER_PASSWORD_NOT_SAME") {
        throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    } else {
      if (error.code === "INPUT_VALID_ERROR") {
        throw new Error(
          "입력 값 검증 중 에러가 발생 하였습니다. 다시 시도해 주세요."
        );
      }
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
  // request.post 에서 정형화 된 error 객체를, addUser의 상황에 맞게 더 정형화 된 error 객체로 변환
  return output as AddUserOutput;
};
