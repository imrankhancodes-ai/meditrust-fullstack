import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, RoleRoute } from "../components/layout/ProtectedRoute";
import DashboardSidebar from "../components/layout/DashboardSidebar";

import Home from "../pages/Home";
import { Login, Register } from "../pages/auth/Auth";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import { MyOrders, OrderDetail } from "../pages/orders/Orders";
import UploadPrescription from "../pages/prescriptions/UploadPrescription";
import PrescriptionResult from "../pages/prescriptions/PrescriptionResult";
import MyPrescriptions from "../pages/prescriptions/MyPrescriptions";
import DoctorList from "../pages/doctors/DoctorList";
import DoctorProfile from "../pages/doctors/DoctorProfile";
import BecomeDoctor from "../pages/doctors/BecomeDoctor";
import LabList from "../pages/pathology/LabList";
import LabProfile from "../pages/pathology/LabProfile";
import BecomePathologist from "../pages/pathology/BecomePathologist";
import ChatPage from "../pages/chat/ChatPage";
import Profile from "../pages/account/Profile";
import DoctorAppointments from "../pages/dashboard/doctor/DoctorAppointments";
import PathologistTests from "../pages/dashboard/pathologist/PathologistTests";
import PathologistAppointments from "../pages/dashboard/pathologist/PathologistAppointments";
import AdminUsers from "../pages/dashboard/admin/AdminUsers";
import AdminProducts from "../pages/dashboard/admin/AdminProducts";
import AdminProductForm from "../pages/dashboard/admin/AdminProductForm";
import AdminVerifications from "../pages/dashboard/admin/AdminVerifications";
import AdminOrders from "../pages/dashboard/admin/AdminOrders";
import AdminCredits from "../pages/dashboard/admin/AdminCredits";
import NotFound from "../pages/NotFound";

function DashboardShell({ children }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:pid" element={<ProductDetail />} />

      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/order-success/:oid" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      <Route path="/orders/:oid" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

      <Route path="/prescriptions/upload" element={<ProtectedRoute><UploadPrescription /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><MyPrescriptions /></ProtectedRoute>} />
      <Route path="/prescriptions/:pid" element={<ProtectedRoute><PrescriptionResult /></ProtectedRoute>} />

      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/doctors/:did" element={<DoctorProfile />} />
      <Route path="/become-doctor" element={<ProtectedRoute><BecomeDoctor /></ProtectedRoute>} />

      <Route path="/labs" element={<LabList />} />
      <Route path="/labs/:pid" element={<LabProfile />} />
      <Route path="/become-pathologist" element={<ProtectedRoute><BecomePathologist /></ProtectedRoute>} />

      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/dashboard/doctor/appointments" element={<RoleRoute roles={["DOCTOR", "ADMIN"]}><DashboardShell><DoctorAppointments /></DashboardShell></RoleRoute>} />

      <Route path="/dashboard/pathologist/tests" element={<RoleRoute roles={["PATHOLOGIST", "ADMIN"]}><DashboardShell><PathologistTests /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/pathologist/appointments" element={<RoleRoute roles={["PATHOLOGIST", "ADMIN"]}><DashboardShell><PathologistAppointments /></DashboardShell></RoleRoute>} />

      <Route path="/dashboard/admin/users" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminUsers /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/products" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminProducts /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/products/new" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminProductForm /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/products/:pid/edit" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminProductForm /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/verifications" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminVerifications /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/orders" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminOrders /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin/credits" element={<RoleRoute roles={["ADMIN"]}><DashboardShell><AdminCredits /></DashboardShell></RoleRoute>} />
      <Route path="/dashboard/admin" element={<Navigate to="/dashboard/admin/users" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
