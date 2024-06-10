import { request } from "@/common/utils/ajax";
import { BusinessError } from "@/common/error";

type UpdateSpecificationInput = {
  medicine: string;
  specificationFile: File;
};

export const updateSpecification = async (
  formData: UpdateSpecificationInput
) => {
  let output;

  try {
    output = await request.post(
      "/api/tool-managing-system/meidicine/update_specification",
      formData
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "MEDICINE_NOT_EXISTED") {
        throw new BusinessError(
          "MEDICINE_NOT_EXISTED",
          "Medicine is not existed"
        );
      } else {
        throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
      }
    }
    throw new BusinessError("UNKNOWN_ERROR", "Unknown error occurred");
  }
  return output;
};
