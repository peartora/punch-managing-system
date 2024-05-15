import { request } from "../utils/ajax";

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
    if (error.message === "USER_USERNAME_DUPLICATED") {
      throw new Error("==이미 존재하는 사용자 이름입니다.==");
    } else if (error.message === "USER_PASSWORD_SHORT") {
      throw new Error("==비밀번호가 너무 짧습니다.==");
    } else {
      throw new Error("==비밀번호 확인이 일치하지 않습니다.==");
    }
  }
  // request.post 에서 정형화 된 error 객체를, addUser의 상황에 맞게 더 정형화 된 error 객체로 변환
  return output as AddUserOutput;
};
