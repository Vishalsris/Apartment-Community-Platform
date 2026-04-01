import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, AlertTriangle, ShieldCheck, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Residents', value: '145', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Pending Complaints', value: '12', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { label: 'Pending Events', value: '3', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Active Admins', value: '4', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  const eventActivityData = [
    { month: 'Jan', Approved: 4, Pending: 2 },
    { month: 'Feb', Approved: 6, Pending: 3 },
    { month: 'Mar', Approved: 8, Pending: 2 },
    { month: 'Apr', Approved: 12, Pending: 5 },
    { month: 'May', Approved: 10, Pending: 3 },
  ];

  const complaintActivityData = [
    { month: 'Jan', Resolved: 15, 'In Progress': 4 },
    { month: 'Feb', Resolved: 10, 'In Progress': 8 },
    { month: 'Mar', Resolved: 22, 'In Progress': 5 },
    { month: 'Apr', Resolved: 18, 'In Progress': 6 },
    { month: 'May', Resolved: 25, 'In Progress': 3 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <DashboardLayout>
      <div className="mb-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 relative">
          <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
             Admin Control Panel
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">System overview and management quick links.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            <SkeletonLoader type="card" count={4} className="h-32 rounded-3xl" />
          ) : (
            stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className={`bg-white rounded-3xl p-6 border ${stat.border} shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden h-full`}>
                  <div className={`absolute -right-6 -top-6 w-20 h-20 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
                  <div className="flex items-center justify-between relative z-10 w-full">
                    <div>
                      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none mb-1">{stat.value}</h3>
                      <p className="text-gray-500 text-xs font-bold tracking-wider uppercase mt-1">{stat.label}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon size={26} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8">
               <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Platform Events Overview</h2>
               <p className="text-gray-500 text-sm mb-8">Admin view of total platform events processing.</p>
               <div className="w-full h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={eventActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorAdminApproved" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorAdminPending" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} />
                     <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                     <Area type="monotone" dataKey="Approved" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminApproved)" />
                     <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminPending)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8">
               <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Platform Complaints Overview</h2>
               <p className="text-gray-500 text-sm mb-8">Admin view of platform complaint status.</p>
               <div className="w-full h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={complaintActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorAdminResolved" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorAdminInProgress" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} />
                     <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                     <Area type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminResolved)" />
                     <Area type="monotone" dataKey="In Progress" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminInProgress)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] p-8 h-full relative overflow-hidden group flex flex-col items-center justify-center text-center">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
               <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 relative z-10 border border-white/20">
                 <ShieldCheck size={40} className="text-white" />
               </div>
               <h3 className="text-2xl font-bold text-white relative z-10 mb-1">{user?.name}</h3>
               <p className="text-indigo-200 uppercase tracking-widest text-xs font-bold relative z-10 mb-8">System Administrator</p>
               
               <div className="w-full space-y-4 relative z-10">
                 <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl">
                   <Mail className="text-indigo-300" size={18} />
                   <span className="text-white font-medium text-sm truncate">{user?.email}</span>
                 </div>
                 {user?.phoneNumber && (
                   <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-2xl">
                     <Phone className="text-indigo-300" size={18} />
                     <span className="text-white font-medium text-sm">{user?.phoneNumber}</span>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
