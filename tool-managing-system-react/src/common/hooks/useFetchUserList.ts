import { useState, useCallback } from "react";

import { getUserList } from "@/common/actions/user/getUserList";

type User = {
  username: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
  notExpired: boolean;
  createdDate: string;
};

export const useFetchUserList = async function () {
  console.log(`useFetchUserList`);

  const [userList, setUserList] = useState<User[]>([]);
  const [key, setKey] = useState(() => Date.now());

  const output = await getUserList();

  console.log("output in useFetchUserList");
  console.log(output.success.data.userList);

  setUserList(output.success.data.userList);

  console.log("userList");
  console.log(userList);

  const userRefetch = useCallback(() => {
    setKey(Date.now());
  }, []);

  return {
    userList,
    userRefetch,
  };
};
