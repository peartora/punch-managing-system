import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type AddMedicineInput = {
  medicine: string;
  specificationFile: File;
};

export const addMedicine = async (input: AddMedicineInput) => {
  let output;

  try {
    output = await request.post(`/api/tool-managing-system/meidicine`, input);
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "MEDICINE_NAME_ALREADY_EXISTED") {
        throw new Error("이미 존재하는 약품입니다.");
      } else if (error.code === "SPECIFICATION_FILE_NOT_EXIST") {
        throw new Error("사양서 파일이 존재 하지 않습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output;
};
