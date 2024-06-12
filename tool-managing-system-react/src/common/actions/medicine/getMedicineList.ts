import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export const getMedicineList = async () => {
  let output;

  try {
    output = await request.get(
      `api/tool-managing-system/meidicine/getMedicine`
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "NO_MEDICINE_REGISTERED") {
        throw new Error("약품이 등록되어 있지 않습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
  return output;
};
