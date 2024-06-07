import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

type AddSupplierInput = {
  supplier: string;
};

export const addSupplier = async function (body: AddSupplierInput) {
  let output;

  try {
    output = await request.post(`/api/tool-managing-system/supplier`, body);
  } catch (error) {
    if (error.code === "SUPPLIER_NAME_ALREADY_EXISTED") {
      throw new Error("해당 supplier는 이미 등록 되었습니다.");
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output;
};
