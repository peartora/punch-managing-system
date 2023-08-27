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
    path: "/find-password",
    element: <PasswordChangePage />,
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
