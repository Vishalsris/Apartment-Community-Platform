import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResidentDashboard from './pages/resident/DashboardOverview';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/ComplaintsManagement';
import AdminEvents from './pages/admin/EventApprovals';
import BusinessManagement from './pages/admin/BusinessManagement';
import MarketplaceManagement from './pages/admin/MarketplaceManagement';
import UserManagement from './pages/admin/UserManagement';
import Profile from './pages/resident/Profile';
import Complaints from './pages/resident/Complaints';
import Events from './pages/resident/Events';
import BusinessDirectory from './pages/resident/BusinessDirectory';
import Marketplace from './pages/resident/Marketplace';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') {
    return <AdminDashboard />;
  }
  return <ResidentDashboard />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
      <Route path="/businesses" element={<PrivateRoute><BusinessDirectory /></PrivateRoute>} />
      <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin/complaints" element={<PrivateRoute roles={['Admin']}><AdminComplaints /></PrivateRoute>} />
      <Route path="/admin/events" element={<PrivateRoute roles={['Admin']}><AdminEvents /></PrivateRoute>} />
      <Route path="/admin/businesses" element={<PrivateRoute roles={['Admin']}><BusinessManagement /></PrivateRoute>} />
      <Route path="/admin/marketplace" element={<PrivateRoute roles={['Admin']}><MarketplaceManagement /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute roles={['Admin']}><UserManagement /></PrivateRoute>} />
      
      {/* Root Route directs to role-based dashboard */}
      <Route path="/" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-textMain transition-colors duration-300">
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              borderRadius: '12px',
            }
          }} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
