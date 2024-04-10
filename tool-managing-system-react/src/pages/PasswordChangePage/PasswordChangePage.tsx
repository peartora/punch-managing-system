import { NavBar } from "@/common/components/NavBar";

import { ChangePassword } from "./components/CheckIdAndPassword/components/ChangePassword";

export function PasswordChangePage() {
  return (
    <main>
      <NavBar />
      <ChangePassword />
    </main>
  );
}
