import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

export const getSupplierList = async () => {
  let output;

  try {
    output = await request.get(`/api/tool-managing-system/supplier`);
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "SUPPLIER_NOT_EXISTED") {
        throw new BusinessError(
          "SUPPLIER_NOT_EXISTED",
          "등록된 공급업체가 없습니다."
        );
      } else {
        throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
      }
    }
    throw new Error("UNKNOWN_ERROR");
  }

  return output;
};
