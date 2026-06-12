import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminNav from './components/AdminNav';

import Home from './pages/Home';
import Salons from './pages/Salons';
import SalonDetail from './pages/SalonDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import PaymentSuccess from './pages/PaymentSuccess';

import AdminOverview from './admin/AdminOverview';
import AdminBookings from './admin/AdminBookings';
import AdminServices from './admin/AdminServices';
import AdminSalons from './admin/AdminSalons';
import AdminReviews from './admin/AdminReviews';
import Infrastructure from './admin/Infrastructure';

import { AuthProvider, useAuth } from './context/AuthContext';

function OwnerRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'OWNER') {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Wrap admin pages with the shared admin layout
function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <AdminNav user={user} onLogout={logout} />
      {/* Sub-header */}
      <div className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-5 flex items-end justify-between flex-wrap gap-2">
          <AdminPageTitle />
          <p className="text-[11px] text-[#A09A91] font-mono">Spring Boot 3.3.5 · Java 21 · Microservices</p>
        </div>
      </div>
      <main className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8 animate-fadein">
        {children}
      </main>
      <footer className="bg-white border-t border-[#E8E6E1] py-4 mt-12">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center justify-between text-[11px] text-[#A09A91]">
          <span>&copy; {new Date().getFullYear()} Aura Salon Admin · Built by Ayush Sharma</span>
          <span className="font-mono">Spring Boot Microservices</span>
        </div>
      </footer>
    </div>
  );
}

function AdminPageTitle() {
  const location = useLocation();
  const titles = {
    '/admin':           { title: 'Overview',       sub: 'Dashboard summary across all services' },
    '/admin/bookings':  { title: 'Bookings',        sub: 'Manage all appointments — booking-service' },
    '/admin/services':  { title: 'Services',        sub: 'Service catalog — service-offering' },
    '/admin/salons':    { title: 'Salons',          sub: 'Branch management — salon-service' },
    '/admin/reviews':   { title: 'Reviews',         sub: 'Customer feedback — review-service' },
    '/admin/infra':     { title: 'Infrastructure',  sub: 'Microservice health & JAR builds' },
  };
  const info = titles[location.pathname] || { title: 'Admin', sub: '' };
  return (
    <div>
      <h1 className="font-display text-[24px] font-light text-[#1C1C1A] leading-none">{info.title}</h1>
      <p className="text-[11px] text-[#A09A91] mt-0.5">{info.sub}</p>
    </div>
  );
}

// Customer layout wrapper
function CustomerLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#C9A96E] border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-[12px] text-[#A09A91]">Loading Aura Salon...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer-facing routes */}
        <Route path="/" element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        } />
        <Route path="/salons" element={
          <CustomerLayout>
            <Salons />
          </CustomerLayout>
        } />
        <Route path="/salons/:id" element={
          <CustomerLayout>
            <SalonDetail />
          </CustomerLayout>
        } />
        <Route path="/book/:salonId" element={
          <CustomerLayout>
            <Booking user={user} />
          </CustomerLayout>
        } />
        <Route path="/my-bookings" element={
          <CustomerLayout>
            <MyBookings user={user} />
          </CustomerLayout>
        } />
        <Route path="/profile" element={
          <CustomerLayout>
            <Profile user={user} />
          </CustomerLayout>
        } />
        <Route path="/login" element={
          <Login />
        } />
        <Route path="/payment-success/:id" element={
          <CustomerLayout>
            <PaymentSuccess />
          </CustomerLayout>
        } />

        {/* Admin routes protected by OwnerRoute */}
        <Route path="/admin" element={
          <OwnerRoute>
            <AdminLayout>
              <AdminOverview />
            </AdminLayout>
          </OwnerRoute>
        } />
        <Route path="/admin/bookings" element={
          <OwnerRoute>
            <AdminLayout>
              <AdminBookings />
            </AdminLayout>
          </OwnerRoute>
        } />
        <Route path="/admin/services" element={
          <OwnerRoute>
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          </OwnerRoute>
        } />
        <Route path="/admin/salons" element={
          <OwnerRoute>
            <AdminLayout>
              <AdminSalons />
            </AdminLayout>
          </OwnerRoute>
        } />
        <Route path="/admin/reviews" element={
          <OwnerRoute>
            <AdminLayout>
              <AdminReviews />
            </AdminLayout>
          </OwnerRoute>
        } />
        <Route path="/admin/infra" element={
          <OwnerRoute>
            <AdminLayout>
              <Infrastructure />
            </AdminLayout>
          </OwnerRoute>
        } />

        {/* 404 fallback */}
        <Route path="*" element={
          <CustomerLayout>
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <p className="font-display text-[5rem] font-light text-[#E8E6E1]">404</p>
                <p className="font-display text-[1.5rem] font-light text-[#1C1C1A]">Page not found</p>
                <a href="/" className="mt-4 block text-[#C9A96E] hover:underline text-[13px]">← Back to Home</a>
              </div>
            </div>
          </CustomerLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainRoutes />
    </AuthProvider>
  );
}

