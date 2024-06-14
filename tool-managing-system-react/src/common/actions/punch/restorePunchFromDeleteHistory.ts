import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const restorePunchFromDeleteHistory = async function (body) {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/punch/restorePunchFromDeleteHistory`,
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXISTED") {
        throw Error(`해당 ID의 펀치는 등록 되지 않았습니다.`);
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw Error(`현재 로그인 된 사용자는 해당 요청의 권한이 없습니다.`);
      } else {
        throw Error(`UNKNOWN_ERROR`);
      }
    }
    throw Error(`UNKNOWN_ERROR`);
  }
  return output;
};
