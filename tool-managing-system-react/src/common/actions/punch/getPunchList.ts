import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const getPunchList = async function (query: string) {
  console.log(`getPunchList called`);
  console.log(`query`, query);

  let output;

  try {
    output = await request.get(`/api/tool-managing-system/punch?${query}`);
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "PUNCH_ID_NOT_EXIST") {
        throw Error("등록된 펀치가 없습니다.");
      } else {
        throw Error("Unknown error");
      }
    }
    throw Error("Unknown error");
  }
  return output;
};
