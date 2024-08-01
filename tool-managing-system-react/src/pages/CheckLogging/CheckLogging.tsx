import { useState } from "react";

import { NavBar } from "@/common/components/NavBar";

import { checkAuthorityAction } from "@/common/actions/user/checkAuthorityAction";
import { useAuth } from "@/common/contexts/auth";
import { FetchLoggingHistory } from "./FetchLoggingHistory";

export function CheckLogging() {
  const [checkResult, setCheckResult] = useState(false);

  const { user } = useAuth();

  console.log(`user is: ${user}`);

  const checkAuthority = async (user: string | undefined) => {
    let output;

    if (user !== null) {
      try {
        output = await checkAuthorityAction(user);
      } catch (error) {
        alert(error.message);
        return;
      }

      if (output != null) {
        setCheckResult(true);
      }
    }
  };

  checkAuthority(user);

  if (!checkResult) {
    return (
      <main>
        <NavBar />
        <p>logging 이력을 열람 할 수 있는 권한이 없습니다.</p>;
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <FetchLoggingHistory />;
    </main>
  );
}
