import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 w-full transition-colors duration-300 shadow-sm">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-textMuted hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
              <div className="px-4 py-2 border-b border-border shadow-sm font-semibold text-textMain">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-textMain">Water Supply Maintenance</p>
                  <p className="text-xs text-textMuted mt-1">Water supply will be interrupted tomorrow.</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-textMain">Weekend Yoga Session</p>
                  <p className="text-xs text-textMuted mt-1">Join us at the clubhouse at 7 AM.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className={`w-9 h-9 flex items-center justify-center rounded-full overflow-hidden shadow-sm ${user?.avatarUrl ? '' : 'bg-indigo-100 text-primary font-bold'}`}>
              {user?.avatarUrl ? (
                 <img src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`} className="w-full h-full object-cover" />
              ) : (
                 Object.keys(user || {}).length > 0 ? user.name?.charAt(0).toUpperCase() : <User size={18} />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-textMain leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-textMuted">{user?.role || 'Role'}</p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-2 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-textMain hover:bg-gray-50 flex items-center gap-2 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={16} /> Profile
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
