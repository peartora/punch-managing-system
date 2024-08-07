import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./common/contexts/auth";

import { HomePage } from "./pages/HomePage";
import { RegisterProductPage } from "./pages/RegisterProductPage";
import { RegisterPunchPage } from "./pages/RegisterPunchPage";
import { ModifyProductFormPage } from "./pages/ModifyProductFormPage";
import { RegisterSupplierPage } from "@/pages/RegisterSupplierPage";
import { Overview } from "./pages/Overview";
import { PunchDeleteHistory } from "@/pages/PunchDeleteHistory";
import { LoginPage } from "./pages/LoginPage";
import { PasswordChangePage } from "./pages/PasswordChangePage";
import { MyPage } from "./pages/MyPage";
import { CreateId } from "./pages/CreateId";
import { ChangePasswordBeforeLogin } from "./pages/PasswordChangeBeforeLogin/components/ChangePasswordBeforeLogin";
import { CheckLogging } from "./pages/CheckLogging/checkLogging";

const routerAfterLogin = createHashRouter([
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
  {
    path: "/",
    element: <Overview />,
  },
  {
    path: "/register-product",
    element: <RegisterProductPage />,
  },
  {
    path: "/register-punch",
    element: <RegisterPunchPage />,
  },
  {
    path: "/modify-product",
    element: <ModifyProductFormPage />,
  },
  {
    path: "/add-supplier",
    element: <RegisterSupplierPage />,
  },
  {
    path: "/punch-table",
    element: <HomePage />,
  },
  {
    path: "/delete-punch",
    element: <PunchDeleteHistory />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/password-change",
    element: <PasswordChangePage />,
  },
  {
    path: "/check-logging",
    element: <CheckLogging />,
  },
]);

const routerBeforeLogin = createHashRouter([
  {
    path: "*",
    element: <Navigate to="/sign-in" replace />,
  },
  {
    path: "/sign-in",
    element: <LoginPage />,
  },
  {
    path: "/create-id",
    element: <CreateId />,
  },
  {
    path: "/password-change-before-login",
    element: <ChangePasswordBeforeLogin />,
  },
]);

function App() {
  return (
    <AuthProvider
      afterLoginComponent={<RouterProvider router={routerAfterLogin} />}
      beforeLoginComponent={<RouterProvider router={routerBeforeLogin} />}
    />
  );
}

export default App;
