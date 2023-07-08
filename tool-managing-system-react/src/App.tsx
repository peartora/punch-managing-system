import {
  createHashRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import RegisterProductPage from "./pages/RegisterProductPage";
import RegisterPunchPage from "./pages/RegisterPunchPage";
import ModifyProductFormPage from "./pages/ModifyProductFormPage";
import RegisterSupplierPage from "@/pages/RegisterSupplierPage";
import Overview from "./pages/Overview";
// import PrintCleanHistory from "./pages/PrintCleanHistory";
import PunchDeleteHistory from "./pages/PunchDeleteHistory";

const router = createHashRouter([
  {
    path: "/",
    element: <Overview />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
