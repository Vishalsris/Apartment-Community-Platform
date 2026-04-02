import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Check, X, ShoppingBag, DollarSign, Image as ImageIcon, Eye, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MarketplaceManagement = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get('/api/marketplace', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setItems(data);
    } catch (error) {
      toast.error('Failed to load marketplace items');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      console.log(`📤 Updating marketplace item ${id} to ${status}`);
      const url = `/api/marketplace/${id}/approval-status`;
      await axios.put(url, { status }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setItems(items.map(i => i._id === id ? { ...i, approvalStatus: status } : i));
      toast.success(status === 'Approved' ? 'Item successfully approved for Marketplace' : 'Item listing rejected', { icon: status === 'Approved' ? '✅' : '🚫' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMsg}`);
      console.error('Update failed:', error);
    }
  };

  const filteredItems = items.filter(i => {
    if (filter === 'All') return true;
    const status = i.approvalStatus || 'Pending';
    return status === filter;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Marketplace Management</h1>
        <p className="text-gray-500 font-medium text-lg">Curate and approve items listed for sale by residents.</p>
      </div>

      {/* Elegant Filter Tabs */}
      <div className="flex gap-2 mb-10 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-max overflow-x-auto relative z-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20 relative z-0">
        <AnimatePresence mode="popLayout">
          {loading ? (
             <SkeletonLoader type="card" count={6} className="aspect-video rounded-[2.5rem]" />
          ) : filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-transparent border-2 border-dashed border-gray-200 rounded-[3rem]"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><ShoppingBag size={32} className="text-gray-300"/></div>
              <h3 className="text-xl font-bold text-gray-700 mb-1">No Items Pending</h3>
              <p className="text-gray-400 font-medium">The marketplace queue is clear.</p>
            </motion.div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col overflow-hidden relative group">
                  
                  {/* Image Container */}
                  <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} strokeWidth={1} />
                      </div>
                    )}

                    {item.status === 'Sold' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[1px]"></div>
                        <div className="relative bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-md text-white px-6 py-2 rounded-2xl text-xl font-black tracking-[0.2em] shadow-2xl rotate-[-12deg] border-2 border-white/30 uppercase">
                          Sold
                        </div>
                      </div>
                    )}

                    {/* Top glass badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
                       <span className={`px-3 py-1 pb-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md border ${
                         item.approvalStatus === 'Approved' ? 'bg-emerald-500/90 text-white border-emerald-400/50' :
                         item.approvalStatus === 'Rejected' ? 'bg-rose-500/90 text-white border-rose-400/50' : 'bg-white/90 text-amber-600 border-amber-100/50'
                       }`}>
                         {item.approvalStatus || 'Pending'}
                       </span>

                       <button 
                         onClick={() => window.open(item.imageUrl, '_blank')}
                         disabled={!item.imageUrl}
                         className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-gray-600 shadow-sm hover:text-indigo-600 transition-all disabled:opacity-0 pointer-events-auto border border-white/50"
                       >
                         <Eye size={16} className="stroke-[2.5]" />
                       </button>
                    </div>

                    {/* Bottom floating price */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                       <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-lg flex items-center gap-1 border border-white">
                          <DollarSign size={14} className="text-gray-400 stroke-[3]" />
                          <span className="text-lg font-black text-gray-900 tracking-tight">{item.price}</span>
                       </div>
                       
                       <div className="bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-gray-700/50 text-[10px] font-bold uppercase tracking-widest text-white">
                          {item.condition}
                       </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-6 font-medium leading-relaxed">{item.description}</p>
                    
                    <div className="mt-auto flex flex-col gap-4">
                       
                       {/* Seller Info */}
                       <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-indigo-500 shadow-sm">
                             <User size={16} className="stroke-[2.5]" />
                          </div>
                          <div className="flex-1 truncate">
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Seller Identity</p>
                             <p className="text-sm font-bold text-gray-800 truncate">{item.seller?.name || 'Unknown'}</p>
                          </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="flex gap-3 pt-2">
                         <button 
                           onClick={() => handleStatusUpdate(item._id, 'Approved')}
                           disabled={item.approvalStatus === 'Approved' || item.status === 'Sold'}
                           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                             (item.approvalStatus === 'Approved' || item.status === 'Sold') ? 'bg-emerald-50 border-emerald-50 text-emerald-300 opacity-50 cursor-not-allowed' : 'bg-white border-gray-100 text-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white shadow-sm hover:shadow-emerald-200/50 hover:-translate-y-0.5'
                           }`}
                         >
                            <Check size={16} className="stroke-[2.5]" /> Approve
                         </button>

                         <button 
                           onClick={() => handleStatusUpdate(item._id, 'Rejected')}
                           disabled={item.approvalStatus === 'Rejected' || item.status === 'Sold'}
                           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                             (item.approvalStatus === 'Rejected' || item.status === 'Sold') ? 'bg-rose-50 border-rose-50 text-rose-300 opacity-50 cursor-not-allowed' : 'bg-white border-gray-100 text-rose-500 hover:bg-rose-500 hover:border-rose-500 hover:text-white shadow-sm hover:shadow-rose-200/50 hover:-translate-y-0.5'
                           }`}
                         >
                            <X size={16} className="stroke-[2.5]" /> Reject
                         </button>
                       </div>
                    </div>
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

export default MarketplaceManagement;
