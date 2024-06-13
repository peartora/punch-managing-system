import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const scrapPunch = async (body) => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/punch/updateStatus/scrap`,
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXISTED") {
        throw Error(`해당 ID의 펀치는 등록 되지 않았습니다.`);
      } else if (error.code === "PUNCH_ID_ALREADY_EXISTED") {
        throw Error(`해당 ID의 펀치는 이미 폐기 리스트에 포함 되었습니다.`);
      } else {
        throw Error(`알 수 없는 Error가 발생 하였습니다.`);
      }
    }
    throw Error(`알 수 없는 Error가 발생 하였습니다.`);
  }
  return output;
};
