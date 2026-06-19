import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MasterData } from './pages/MasterData';
import { DataUpload } from './pages/DataUpload';
import { RiskMatrix } from './pages/RiskMatrix';
import { AnalysisEngine } from './pages/AnalysisEngine';
import { Findings } from './pages/Findings';
import { RisksReports } from './pages/RisksReports';
import { ExecutiveReport } from './pages/ExecutiveReport';
import { ErrorPage } from './components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard />, errorElement: <ErrorPage /> },
      { path: 'data-upload', element: <DataUpload />, errorElement: <ErrorPage /> },
      { path: 'master-data', element: <MasterData />, errorElement: <ErrorPage /> },
      { path: 'risk-matrix', element: <RiskMatrix />, errorElement: <ErrorPage /> },
      { path: 'analysis-engine', element: <AnalysisEngine />, errorElement: <ErrorPage /> },
      { path: 'findings', element: <Findings />, errorElement: <ErrorPage /> },
      { path: 'risks-reports', element: <RisksReports />, errorElement: <ErrorPage /> },
      { path: 'executive-report', element: <ExecutiveReport />, errorElement: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
