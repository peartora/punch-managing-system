import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type ApproveIdInput = {
  username: string;
};

export type ApproveIdOutput = {
  success: Record<string, string>;
};

export const approveId = async (
  input: ApproveIdInput
): Promise<ApproveIdOutput> => {
  let output;

  try {
    output = await request.post(
      `/api/tool-managing-system/admin/approveId`,
      input
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("user가 존재 하지 않습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output as ApproveIdOutput;
};
