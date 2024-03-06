import { request } from "@/common/utils/ajax";

type Body = {
  username: string;
  password: string;
};

export const checkUser = function (body: Body): Promise<string> {
  return request
    .post(`/api/tool-managing-system/usercheck`, body)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `id: ${body.username}의 상태를 확인 중 network ereror가 발생 하였습니다.`
        );
      }
      return response.text();
    });
};
