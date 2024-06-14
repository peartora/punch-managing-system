import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const getDeleteHistory = async (query) => {
  let output;

  try {
    output = await request.get(
      `/api/tool-managing-system/punch/getDeletedPunchList?${query}`
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_DELETE_HISTORY_NOT_EXIST") {
        throw Error("선택 된 Medicine에 해당 되는 펀치 삭제 이력이 없습니다.");
      } else {
        throw Error("UNKNOWN ERROR");
      }
    }
    throw Error("UNKNOWN ERROR");
  }
  return output;
};
