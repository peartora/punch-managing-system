import { Route, Routes } from "react-router-dom";
import PrintPage from "./PrintPage";

export default function PrintCleanHistory() {
  return (
    <Routes>
      <Route path="/:punchId/:date" element={<PrintPage />} />
    </Routes>
  );
}
