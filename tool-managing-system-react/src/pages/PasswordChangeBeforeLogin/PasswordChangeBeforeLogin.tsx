import { NavBar } from "@/common/components/NavBar";

import { ChangePasswordBeforeLogin } from "./components/ChangePasswordBeforeLogin";

export function PasswordChangePage() {
  return (
    <main>
      <NavBar />
      <ChangePasswordBeforeLogin />
    </main>
  );
}
