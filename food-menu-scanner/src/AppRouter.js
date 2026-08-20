import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CustomerApp from './App';
import './admin/admin.css';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminPlaceholder from './admin/AdminPlaceholder';
import AddRestaurantPage from './admin/AddRestaurantPage';
import RestaurantsPage from './admin/RestaurantsPage';
import RestaurantDetailPage from './admin/RestaurantDetailPage';
import { AdminAuthProvider } from './admin/auth/AdminAuthContext';
import ProtectedAdminRoute from './admin/auth/ProtectedAdminRoute';
import { ToastProvider } from './admin/components/Toast';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<CustomerApp />} />

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="restaurants" element={<RestaurantsPage />} />
              <Route path="restaurants/new" element={<AddRestaurantPage />} />
              <Route path="restaurants/:restaurantId" element={<RestaurantDetailPage />} />
              <Route
                path="qr"
                element={
                  <AdminPlaceholder
                    title="QR Management"
                    description="Prepare restaurant → branch → table → unique QR codes (/r/{slug}/t/{token})."
                  />
                }
              />
              <Route
                path="analytics"
                element={
                  <AdminPlaceholder
                    title="Analytics"
                    description="Platform-wide restaurant performance and QR scan insights."
                  />
                }
              />
              <Route
                path="subscriptions"
                element={
                  <AdminPlaceholder
                    title="Subscriptions"
                    description="Manage Free, Starter, Professional, and Enterprise plans."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <AdminPlaceholder
                    title="Settings"
                    description="Platform settings, audit preferences, and Super Admin account options."
                  />
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
