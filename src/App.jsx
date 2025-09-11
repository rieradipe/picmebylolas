import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useDemoSeed from "./hooks/UseDemoSeed.js";

import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";

import HomePage from "./pages/homePage/HomePage.jsx";
import MapPage from "./pages/mapPage/MapPage.jsx";
import CatalogPage from "./pages/catalogPage/CatalogPage.jsx";
import CartPage from "./pages/cartPage/CartPage.jsx";
import PolicyPage from "./pages/policyPage/PolicyPage.jsx";
import QrAccessPage from "./pages/qr/QrAccessPage.jsx";

import StaffOrdersPage from "./pages/staff/staff/StaffOrdersPage.jsx";
import InventoryPage from "./pages/staff/inventory/InventoryPage.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";

import LoginPage from "./pages/auth/LoginPage.jsx"; // <- pág. de login

import styles from "./styles/App.module.css";

function AppRoutes() {
  useDemoSeed();

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/qr" element={<QrAccessPage />} />

      {/* Staff */}
      <Route
        path="/staff/orders"
        element={
          <ProtectedRoute allow={["CAMARERO", "ADMIN"]}>
            <StaffOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/inventory"
        element={
          <ProtectedRoute allow={["CAMARERO", "ADMIN"]}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allow={["ADMIN"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className={styles.container}>
        <Header />
        <main className={styles.mainContainer}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
