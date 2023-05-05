import { createHashRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";

const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
