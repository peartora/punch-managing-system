import { request } from "../utils/ajax";

export type AddUserInput = {
  username: string;
  password: string;
  passwordConfirmation: string;
  role: string;
};

export type AddUserOutput = {
  username: string;
};

export const addUser = async (input: AddUserInput): Promise<AddUserOutput> => {
  const output = await request.post(`/api/tool-managing-system/users`, input);
  // request.post 에서 정형화 된 error 객체를, addUser의 상황에 맞게 더 정형화 된 error 객체로 변환
  return output as AddUserOutput;
};
