import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Check, X, Globe, Mail, Phone, ExternalLink, ShieldCheck, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BusinessManagement = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data } = await axios.get('/api/businesses', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBusinesses(data);
    } catch (error) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      console.log(`📤 Updating business ${id} to ${status}`);
      const url = `/api/businesses/${id}/status`;
      await axios.put(url, { status }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBusinesses(businesses.map(b => b._id === id ? { ...b, approvalStatus: status } : b));
      toast.success(`Business ${status.toLowerCase()}`, { icon: status === 'Approved' ? '✅' : '🚫' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMsg}`);
      console.error('Update failed:', error);
    }
  };

  const filteredBusinesses = businesses.filter(b => {
    if (filter === 'All') return true;
    const status = b.approvalStatus || 'Pending';
    return status === filter;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Business Approvals</h1>
        <p className="text-gray-500 font-medium text-lg">Review and manage commercial listings for your community.</p>
      </div>

      {/* Elegant Filter Tabs */}
      <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-max overflow-x-auto">
        {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${
              filter === f ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <SkeletonLoader type="card" count={4} className="h-48 rounded-[2rem]" />
          ) : filteredBusinesses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-transparent border-2 border-dashed border-gray-200 rounded-[3rem]"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Building2 size={32} className="text-gray-300"/></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1">No Businesses Found</h3>
              <p className="text-gray-400 font-medium">There are currently no listings matching the selected status.</p>
            </motion.div>
          ) : (
            filteredBusinesses.map((business) => (
              <motion.div
                key={business._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row overflow-hidden relative group">
                  
                  {/* Left branding segment */}
                  <div className="md:w-48 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center relative border-r border-gray-100 whitespace-nowrap">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 md:right-4 md:left-auto">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        business.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        business.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {business.approvalStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-[3px] border-white bg-white flex items-center justify-center mt-6 md:mt-2 mb-3">
                      {business.logoUrl ? (
                         <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-3xl font-black text-indigo-200">{business.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-white text-indigo-500 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-indigo-50 shrink-0 mx-auto w-max max-w-[130px] truncate text-center">
                      {business.category}
                    </span>
                  </div>

                  {/* Middle content segment */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col relative w-full overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">{business.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6">{business.description}</p>
                    
                    <div className="space-y-2 mt-auto">
                      {business.contactEmail && (
                        <div className="flex items-center text-xs text-gray-600 font-medium gap-2">
                           <Mail size={14} className="text-gray-400" /> <span className="truncate">{business.contactEmail}</span>
                        </div>
                      )}
                      {business.contactPhone && (
                        <div className="flex items-center text-xs text-gray-600 font-medium gap-2">
                           <Phone size={14} className="text-gray-400" /> {business.contactPhone}
                        </div>
                      )}
                      {business.website && (
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-indigo-500 font-bold gap-2 hover:underline w-fit">
                           <Globe size={14} /> View Website <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right actions segment */}
                  <div className="md:w-20 bg-gray-50/50 flex flex-row md:flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-gray-100 gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(business._id, 'Approved')}
                      disabled={business.approvalStatus === 'Approved'}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        business.approvalStatus === 'Approved' ? 'bg-emerald-50 text-emerald-300 cursor-not-allowed' : 'bg-white border border-gray-200 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm'
                      }`}
                      title="Approve Listing"
                    >
                       <Check size={18} className="stroke-[2.5]" />
                    </button>
                    
                    <button 
                      onClick={() => handleStatusUpdate(business._id, 'Rejected')}
                      disabled={business.approvalStatus === 'Rejected'}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        business.approvalStatus === 'Rejected' ? 'bg-rose-50 text-rose-300 cursor-not-allowed' : 'bg-white border border-gray-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-sm'
                      }`}
                      title="Reject Listing"
                    >
                       <X size={18} className="stroke-[2.5]" />
                    </button>
                  </div>

                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BusinessManagement;
