import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const updatePunchStatus = async (body) => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/punch/updateStatus`,
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXISTED") {
        throw Error(`해당 펀치는 등록 되지 않았습니다.`);
      } else if (error.code === "DB_ERROR") {
        throw Error(`DB 연산 중 Error가 발생 하였습니다.`);
      } else {
        throw Error(`UNKNOW ERROR OCCURED`);
      }
    }
    throw Error(`UNKNOW ERROR OCCURED`);
  }
  return output;
};
