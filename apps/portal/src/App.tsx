import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MasterData } from './pages/MasterData';
import { DataUpload } from './pages/DataUpload';
import { RiskMatrix } from './pages/RiskMatrix';
import { AnalysisEngine } from './pages/AnalysisEngine';
import { Findings } from './pages/Findings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'data-upload', element: <DataUpload /> },
      { path: 'master-data', element: <MasterData /> },
      { path: 'risk-matrix', element: <RiskMatrix /> },
      { path: 'analysis-engine', element: <AnalysisEngine /> },
      { path: 'findings', element: <Findings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
