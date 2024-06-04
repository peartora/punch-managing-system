import { request } from "@/common/utils/ajax";

export async function getUserList() {
  console.log(`getUserList 비동기 함수 called`);
  try {
    const result = await request.get("/api/tool-managing-system/users");

    return result;
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    throw error;
  }
}
