import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const getCleanHistory = async (query) => {
  let output;

  try {
    output = await request.get(
      `/api/tool-managing-system/punch/getCleanHistory?${query.toString()}`
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXISTED") {
        throw Error("등록되지 않은 펀치 Id 입니다.");
      } else {
        throw Error("UNKWON ERROR");
      }
    }
    throw Error("UNKWON ERROR");
  }
  return output;
};
