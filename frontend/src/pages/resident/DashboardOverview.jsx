import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { Home, Users, Calendar, AlertTriangle, ArrowRight, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';


const ResidentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Community Events', value: '4', icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', route: '/events' },
    { label: 'My RSVPs', value: '2', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', route: '/events' },
    { label: 'Pending Requests', value: '0', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', route: '/complaints' },
  ];

  const eventActivityData = [
    { month: 'Jan', Approved: 2, Pending: 1 },
    { month: 'Feb', Approved: 4, Pending: 2 },
    { month: 'Mar', Approved: 5, Pending: 1 },
    { month: 'Apr', Approved: 8, Pending: 3 },
    { month: 'May', Approved: 6, Pending: 2 },
  ];

  const complaintActivityData = [
    { month: 'Jan', Resolved: 5, 'In Progress': 2 },
    { month: 'Feb', Resolved: 7, 'In Progress': 4 },
    { month: 'Mar', Resolved: 12, 'In Progress': 3 },
    { month: 'Apr', Resolved: 15, 'In Progress': 5 },
    { month: 'May', Resolved: 11, 'In Progress': 2 },
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
          <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
             Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Here is what's happening in your community today.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {loading ? (
             stats.map((_, i) => <SkeletonLoader key={i} type="card" className="h-32 rounded-3xl" />)
          ) : (
            stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <div 
                  onClick={() => navigate(stat.route)}
                  className={`bg-white rounded-3xl p-8 border ${stat.border} shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer group hover:-translate-y-1 relative overflow-hidden`}
                >
                  <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`}></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{stat.value}</h3>
                      <p className="text-gray-500 text-sm font-bold tracking-wide mt-1 uppercase">{stat.label}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon size={32} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -z-0"></div>
              
              <div className="flex items-center justify-between mb-8 relative z-10 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                  <BellRing className="text-indigo-500" size={24} />
                  Community Announcements
                </h2>
              </div>

              {loading ? (
                 <div className="space-y-6">
                   <SkeletonLoader type="title" />
                   <SkeletonLoader count={2} />
                 </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div onClick={() => navigate('/complaints')} className="cursor-pointer group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                    <span className="text-xs font-bold tracking-widest text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-3 inline-block uppercase shadow-sm">Maintenance Notice</span>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Water Supply Maintenance</h4>
                    <p className="text-gray-500 font-medium leading-relaxed mt-2">Water supply will be interrupted tomorrow from 10 AM to 2 PM for routine clearing of the main pipes.</p>
                  </div>
                  
                  <div onClick={() => navigate('/events')} className="cursor-pointer group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                    <span className="text-xs font-bold tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mb-3 inline-block uppercase shadow-sm">Community Event</span>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Weekend Yoga Session</h4>
                    <p className="text-gray-500 font-medium leading-relaxed mt-2">Join us at the clubhouse at 7 AM this Saturday for a guided meditation and yoga flow session. Open to all ages.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] p-8 h-full relative overflow-hidden group">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
               
               <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8 relative z-10">Quick Actions</h2>
               
               <div className="flex flex-col gap-4 relative z-10">
                  <div 
                    onClick={() => navigate('/complaints')}
                    className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer flex items-center justify-between group/btn"
                  >
                    <div>
                      <h4 className="font-bold text-white text-lg">Raise a Complaint</h4>
                      <p className="text-indigo-200 text-sm mt-0.5">Report an issue immediately</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-indigo-900 transition-all">
                       <ArrowRight size={20} />
                    </div>
                  </div>

                  <div 
                    onClick={() => navigate('/marketplace')}
                    className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer flex items-center justify-between group/btn"
                  >
                    <div>
                      <h4 className="font-bold text-white text-lg">Browse Marketplace</h4>
                      <p className="text-indigo-200 text-sm mt-0.5">Explore community listings</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/btn:scale-110 group-hover/btn:bg-white group-hover/btn:text-indigo-900 transition-all">
                       <ArrowRight size={20} />
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8">
             <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Events Activity</h2>
             <p className="text-gray-500 text-sm mb-8">Monthly breakdown of community events.</p>
             <div className="w-full h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={eventActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorPendingEvent" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                   <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} />
                   <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                   <Area type="monotone" dataKey="Approved" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApproved)" />
                   <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPendingEvent)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] p-8">
             <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Complaints Activity</h2>
             <p className="text-gray-500 text-sm mb-8">Monthly breakdown of community complaints.</p>
             <div className="w-full h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={complaintActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                   <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} />
                   <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                   <Area type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                   <Area type="monotone" dataKey="In Progress" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInProgress)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
         </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ResidentDashboard;
