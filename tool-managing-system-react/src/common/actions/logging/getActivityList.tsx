import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export const getActivityList = async () => {
  let output;

  try {
    output = await request.get(
      `api/tool-managing-system/logging/getActivityList`
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "ACTIVITY_LIST_NOT_EXISTED") {
        throw new Error("로그에 사용 된 Activity가 없습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
  return output;
};
