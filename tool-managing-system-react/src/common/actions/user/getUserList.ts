import { request } from "@/common/utils/ajax";

export async function getUserList() {
  console.log(`getUserList 비동기 함수 called`);

  let output;

  try {
    output = await request.get("/api/tool-managing-system/users");
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    throw error;
  }

  return output;
}
