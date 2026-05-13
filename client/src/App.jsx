import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

import LoginPage from './pages/Auth/LoginPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import PatientsPage from './pages/Patients/PatientsPage.jsx';
import PatientDetailPage from './pages/Patients/PatientDetailPage.jsx';
import DoctorsPage from './pages/Doctors/DoctorsPage.jsx';
import AppointmentsPage from './pages/Appointments/AppointmentsPage.jsx';
import BillingPage from './pages/Billing/BillingPage.jsx';
import BillingDetailPage from './pages/Billing/BillingDetailPage.jsx';
import ServicesPage from './pages/Services/ServicesPage.jsx';
import LaboratoryPage from './pages/Lab/LaboratoryPage.jsx';
import PharmacyPage from './pages/Pharmacy/PharmacyPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';

const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar role={user?.role} />
      <main className="main-panel">
        <Navbar />
        <div className="content-wrap">{children}</div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="patients/:id" element={<PatientDetailPage />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="billing/:id" element={<BillingDetailPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="laboratory" element={<LaboratoryPage />} />
                <Route path="pharmacy" element={<PharmacyPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        )}
      />
    </Routes>
  );
}

export default App;
