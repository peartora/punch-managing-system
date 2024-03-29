import { useAuth } from "@/common/contexts/auth";

import { MyPage } from "./MyPage";
import { LoginFormPage } from "./LoginFormPage";

export const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <MyPage />;
  } else {
    return <LoginFormPage />;
  }
};
