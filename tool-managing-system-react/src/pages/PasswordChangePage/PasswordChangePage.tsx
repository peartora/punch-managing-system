import { NavBar } from "@/common/components/NavBar";

import { CheckIdAndPassword } from "./components/CheckIdAndPassword";

export function PasswordChangePage() {
  return (
    <main>
      <NavBar />
      <CheckIdAndPassword />
    </main>
  );
}
