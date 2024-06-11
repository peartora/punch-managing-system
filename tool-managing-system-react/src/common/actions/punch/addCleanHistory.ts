import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const addCleanHistory = async (body) => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/punch/addCleanHistory`,
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "") {
      }
    }
  }
  return output;
};
