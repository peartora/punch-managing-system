import { BusinessError } from "@/common/error";
import { request } from "@/common/utils/ajax";

export type UserObject = {
  success: Record<string, string>;
};

export const checkAuthorityAction = async (
  username: string | undefined
): Promise<UserObject> => {
  let output;

  console.log(`username is: ${username}`);

  try {
    output = await request.post(
      `/api/tool-managing-system/users/check_authority`,
      username
    );
  } catch (error) {
    if (error instanceof BusinessError) {
      if (error.code === "USER_IS_NOT_AUTHORIZED") {
        throw new Error("로깅 점검 페이지에 접근 권한이 없습니다.");
      }
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }

  return output as UserObject;
};
