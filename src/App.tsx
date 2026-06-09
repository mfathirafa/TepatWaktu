import { Routes, Route, Navigate } from 'react-router-dom';
import MobileWrapper from './components/MobileWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Standalone pages (no mobile shell)
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import UpgradePremium from './pages/UpgradePremium';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Mobile-wrapped protected pages
import Dashboard from './pages/Dashboard';
import ManageBills from './pages/ManageBills';
import ManageTax from './pages/ManageTax';
import ManageService from './pages/ManageService';
import ManageWarranty from './pages/ManageWarranty';
import DocumentCenter from './pages/DocumentCenter';
import ActivityHistory from './pages/ActivityHistory';
import SettingsPage from './pages/SettingsPage';
import Notifications from './pages/Notifications';
import ReminderDetail from './pages/ReminderDetail';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-medium">Memuat TepatWaktu...</p>
        </div>
      </div>
    );
  }

  return (
    <MobileWrapper>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        {/* Protected pages */}
        <Route path="/*" element={
          <ProtectedRoute>
            <Routes>
              {/* Premium & Payment Flow */}
              <Route path="/upgrade" element={<UpgradePremium />} />
              <Route path="/konfirmasi-pembayaran" element={<PaymentConfirmation />} />
              <Route path="/pembayaran-berhasil" element={<PaymentSuccess />} />
              <Route path="/pembayaran-gagal" element={<PaymentFailed />} />

              {/* Core Features */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/tagihan" element={<ManageBills />} />
              <Route path="/tagihan/detail" element={<ReminderDetail />} />
              <Route path="/pajak" element={<ManageTax />} />
              <Route path="/servis" element={<ManageService />} />
              <Route path="/garansi" element={<ManageWarranty />} />
              <Route path="/dokumen" element={<DocumentCenter />} />
              <Route path="/riwayat" element={<ActivityHistory />} />
              <Route path="/notifikasi" element={<Notifications />} />
              <Route path="/pengaturan" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </MobileWrapper>
  );
}

export default App;
