import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import InventoryPage from "../pages/Inventory/InventoryPage";
import SalesPage from "../pages/Sales/SalesPage";
import ReportsPage from "../pages/Reports/ReportsPage";
import UsersPage from "../pages/User/UserMainPage";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  </AuthProvider>
);

export default AppRoutes;
