import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";
import { Data } from "@/common/types";

export const registerPunch = async (punchIdArrays: Data[]) => {
  let output;

  try {
    output = await request.post(
      "/api/tool-managing-system/punch",
      punchIdArrays
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_REGISTER_FAILED") {
        throw new BusinessError(
          "PUNCH_REGISTER_FAILED",
          "Punch register failed"
        );
      } else {
        throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
      }
    }
    throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
  }

  return output;
};
