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
      }
    }
  }

  return deletedUsername;
};
