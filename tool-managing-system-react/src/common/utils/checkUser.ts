import { request } from "@/common/utils/ajax";

type Body = {
  username: string;
  password: string;
};

export const checkUser = async function (
  body: Body,
  handlers: {
    OK: () => void;
    NOK?: (params: string[]) => void;
  }
): Promise<void> {
  const response = await request.post(
    `/api/tool-managing-system/usercheck`,
    body
  );
  if (!response.ok) {
    throw new Error(
      `id: ${body.username}의 상태를 확인 중 network ereror가 발생 하였습니다.`
    );
  }
  const text = await response.text();
  const [result, ...params] = text.split(",");

  switch (result) {
    case "OK":
      handlers.OK();
      break;
    case "NoId":
      alert(`ID: ${body.username}은(는) 등록 되지 않았습니다.`);
      break;
    case "NotYetApproved":
      alert(`ID: ${body.username}은(는) 미승인 상태 입니다.`);
      break;
    case "Locked":
      alert(`ID: ${body.username}은(는) 잠금 상태 입니다.`);
      break;
    case "Expired":
      alert(`ID: ${body.username}의 비밀번호가 만료 되었습니다.`);
      break;
    case "NOK":
      if (handlers.NOK) {
        handlers.NOK(params);
      }
      break;
    default:
      throw new Error("알 수 없는 에러가 발생 하였습니다.");
  }
};
