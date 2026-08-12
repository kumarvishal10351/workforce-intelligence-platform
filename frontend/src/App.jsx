import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import EmployeeDetail from "./pages/EmployeeDetail";
import PredictPage from "./pages/PredictPage";
import HistoryPage from "./pages/HistoryPage";
import SimulatorPage from "./pages/SimulatorPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="employee/:id" element={<EmployeeDetail />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="predict" element={<PredictPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
