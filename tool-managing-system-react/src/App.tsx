import {
  createHashRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

import { AuthProvider } from "./common/auth";

import HomePage from "./pages/HomePage";
import RegisterProductPage from "./pages/RegisterProductPage";
import RegisterPunchPage from "./pages/RegisterPunchPage";
import ModifyProductFormPage from "./pages/ModifyProductFormPage";
import RegisterSupplierPage from "@/pages/RegisterSupplierPage";
import Overview from "./pages/Overview";
// import PrintCleanHistory from "./pages/PrintCleanHistory";
import PunchDeleteHistory from "./pages/PunchDeleteHistory";
import { LoginPage } from "./pages/LoginPage";
import NavBarForId from "./components/NavBarForId";

const router = createHashRouter([
  {
    path: "/",
    element: <Overview />,
  },
  {
    path: "/sign-in",
    element: <LoginPage />,
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
    path: "/password-change",
    element: <NavBarForId />,
  },
]);

function App() {
  return (
    <AuthProvider
      afterLoginComponent={<RouterProvider router={router} />}
      beforeLoginComponent={<LoginPage />}
    />
  );
}

export default App;
