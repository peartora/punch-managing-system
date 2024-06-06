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

export const useFetchUserList = function (username: string) {
  console.log(`useFetchUserList Customs Hook called`);

  const [userList, setUserList] = useState<User[]>([]);
  const [key, setKey] = useState(() => Date.now());

  useEffect(() => {
    console.log(`=====effect in useFetchUserList called=====`);

    const fetchUserList = async () => {
      console.log(`fetchUserList called in effect`);

      console.log("before getUserList async function called");

      const output = await getUserList();

      console.log(
        "%c after getUserList async function called",
        "background: #eeeeee; color: #0000ff"
      );

      console.log("userList in useFetchUserList");
      console.log(output.success.data.userList);
      setUserList(output.success.data.userList);
    };

    fetchUserList();

    return () => {
      console.log("cleanup in useFetchUserList called");
    };
  }, [username, key]);

  const refetchForUserList = useCallback(() => {
    console.log("refetchForUserList in useFetchForUserList called");
    setKey(Date.now());
  }, []);

  return {
    userList,
    refetchForUserList,
  };
};
