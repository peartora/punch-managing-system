import { useState, useCallback, useEffect } from "react";

import { getUserList } from "@/common/actions/user/getUserList";

export type User = {
  username: string;
  userRole: string;
  notLocked: boolean;
  approved: boolean;
  notExpired: boolean;
  createdDate: string;
};

export const useFetchUserList = function (username: String) {
  console.log(`useFetchUserList`);

  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    console.log(`effect in useFetchUserList called`);

    const fetchUserList = async () => {
      const output = await getUserList();

      console.log("before fetching userlist");
      console.log(output.success.data.userList);

      setUserList(output.success.data.userList);
    };

    fetchUserList();
    console.log("after fetching userlist");
    console.log(userList);
  }, [username]);

  return {
    userList,
  };
};
