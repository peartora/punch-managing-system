import { request } from "@/common/utils/ajax";

export async function getUserList() {
  try {
    const result = await request.get("/api/tool-managing-system/users");
    console.log("getUserList");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Failed to fetch user list:", error);
    throw error;
  }
}
