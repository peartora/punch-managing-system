import { request } from "@/common/utils/ajax";

export async function getUserList() {
  const result = await request.get("/api/tool-managing-system/users");

  console.log("getUserList");
  console.log(result);
  return result;
}
