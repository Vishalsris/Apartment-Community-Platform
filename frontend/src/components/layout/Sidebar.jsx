import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../ui/Button';
import { Home, Users, Calendar, ShoppingBag, AlertTriangle, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, setCollapsed }) => {
  const { user } = useAuth();
  
  const residentNav = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Profile', icon: Users, path: '/profile' },
    { name: 'Complaints', icon: AlertTriangle, path: '/complaints' },
    { name: 'Business Directory', icon: LayoutDashboard, path: '/businesses' },
    { name: 'Events', icon: Calendar, path: '/events' },
    { name: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
  ];

  const adminNav = [
    { name: 'Admin Overview', icon: Home, path: '/' },
    { name: 'Manage Complaints', icon: AlertTriangle, path: '/admin/complaints' },
    { name: 'Event Approvals', icon: Calendar, path: '/admin/events' },
    { name: 'Business Approvals', icon: LayoutDashboard, path: '/admin/businesses' },
    { name: 'Marketplace Management', icon: ShoppingBag, path: '/admin/marketplace' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
  ];

  const navItems = user?.role === 'Admin' ? adminNav : residentNav;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-white border-r border-border shrink-0 flex flex-col z-20 sticky top-0 transition-all duration-300"
    >
      <div className="h-16 flex items-center px-6 border-b border-border justify-between">
        {!isCollapsed && <span className="font-bold text-lg text-primary truncate">CommunityHub</span>}
        <button 
          onClick={() => setCollapsed(!isCollapsed)}
          className={cn('p-1 rounded-md hover:bg-gray-100 text-textMuted', isCollapsed && "mx-auto")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center rounded-xl p-3 font-medium transition-all duration-200 group relative',
              isActive ? 'bg-indigo-50 text-primary' : 'text-textMuted hover:bg-gray-50 hover:text-textMain',
              isCollapsed && 'justify-center'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-textMuted group-hover:text-textMain')} />
                {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
