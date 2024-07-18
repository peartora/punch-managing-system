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
        throw Error(`등록되지 않은 펀치 입니다.`);
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw Error(`폐기 펀치 복구 권한이 없습니다.`);
      } else {
        throw Error(`등록되지 않은 펀치 입니다.`);
      }
    }
    throw Error(`등록되지 않은 펀치 입니다.`);
  }
  return output;
};
