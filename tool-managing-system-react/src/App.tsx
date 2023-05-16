import { createHashRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import RegisterProductPage from "./pages/RegisterProductPage";
import RegisterPunchPage from "./pages/RegisterPunchPage";
import ModifyProductFormPage from "./pages/ModifyProductFormPage";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
