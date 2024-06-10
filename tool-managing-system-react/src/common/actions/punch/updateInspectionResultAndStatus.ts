import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const updateInspectionResultAndStatus = async function (body) {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/punch/updateInspectionResultAndStatus`,
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXISTED") {
        throw Error("해당 펀치가 존재 하지 않습니다.");
      } else {
        throw Error("Unknown error");
      }
    }
    throw Error("Unknown error");
  }
  return output;
};
