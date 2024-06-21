import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

type DeleteUserInput = {
  username: string;
};

type DeleteUserOutput = {
  username: string;
};

export const deleteUser = async function (
  body: DeleteUserInput
): Promise<DeleteUserOutput> {
  let deletedUsername;

  try {
    deletedUsername = await request.post(
      "/api/tool-managing-system/admin/delete_user",
      body
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_EXIST") {
        throw new Error("User가 존재 하지 않습니다.");
      } else if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw new Error("권한이 없습니다.");
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
    throw new Error("알 수 없는 에러가 발생 했습니다.");
  }

  return deletedUsername;
};
