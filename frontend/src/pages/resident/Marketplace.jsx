import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ImageUpload from '../../components/ui/ImageUpload';
import { Plus, Search, MessageCircle, Image, Star, Phone, Mail, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  const [formData, setFormData] = useState({ 
    title: '', description: '', price: '', condition: 'New', imageUrl: ''
  });

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
      setItems([
        { 
          _id: '1', title: 'IKEA Office Chair', description: 'Lightly used ergonomic office chair. Adjustable height.', 
          price: 45, condition: 'Like New', status: 'Available', seller: { name: 'Alice Smith', apartmentNumber: 'B-302' },
          imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80'
        },
        { 
          _id: '2', title: 'Mountain Bike', description: '21-speed mountain bike. Just got it tuned up.', 
          price: 120, condition: 'Good', status: 'Available', seller: { name: 'Bob Johnson', apartmentNumber: 'A-105' },
          imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const { data } = await axios.post('/api/marketplace', { ...formData, price: Number(formData.price) }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setItems([data, ...items]);
      toast.success('Item listed successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', price: '', condition: 'New', imageUrl: '' });
    } catch (error) {
      toast.error('Failed to list item');
    } finally {
      setSubmitLoading(false);
    }
  };

  const markAsSold = async (id) => {
    try {
      await axios.put(`/api/marketplace/${id}/status`, { status: 'Sold' }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setItems(items.map(item => item._id === id ? { ...item, status: 'Sold' } : item));
      toast.success('Item marked as sold');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">Community Marketplace</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Buy and sell items within the community securely.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2.5 font-bold shadow-lg shadow-indigo-200/50 hover:scale-105 transition-all text-base z-10">
          <Plus size={20} className="stroke-[2.5]" /> Sell an Item
        </Button>
      </motion.div>

      <div className="mb-8 relative max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
        <input 
          type="text" 
          placeholder="Search items..." 
          className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 font-medium text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
        {loading ? (
          <SkeletonLoader type="card" count={4} className="h-96 rounded-3xl" />
        ) : items.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-textMuted text-lg font-medium">No approved items currently for sale.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <div className="flex flex-col h-full bg-white overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 group hover:-translate-y-2 relative">
                <div className="h-64 w-full bg-gray-50 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Photo</span>
                    </div>
                  )}
                  
                  {item.status === 'Sold' && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-10">
                       <span className="bg-rose-500 text-white font-black px-6 py-2 rounded-2xl rotate-[-10deg] text-2xl tracking-tighter shadow-2xl border-4 border-white/20">SOLD</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg text-sm font-black text-gray-900 border border-white/50">
                      ${item.price}
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-black text-primary border border-white/50 uppercase tracking-widest leading-none">
                      {item.condition}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1 relative">
                  <div className="absolute top-0 right-8 w-12 h-12 bg-indigo-50 rounded-full blur-2xl -mt-6"></div>
                  
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 truncate group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-primary">
                        {item.seller?.name?.charAt(0)}
                     </div>
                     <span className="text-xs font-bold text-gray-500 truncate">by {item.seller?.name}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between gap-3">
                    {user?._id === item.seller?._id || user?.role === 'Admin' ? (
                       item.status === 'Available' ? (
                         <Button 
                           variant="secondary" 
                           size="sm" 
                           className="w-full rounded-2xl font-bold py-3 h-auto text-xs border-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100" 
                           onClick={() => markAsSold(item._id)}
                         >
                           Mark as Sold
                         </Button>
                       ) : (
                         <button className="w-full py-3 text-xs font-bold text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl cursor-not-allowed" disabled>Already Sold</button>
                       )
                    ) : (
                       <Button 
                         variant="primary" 
                         size="sm" 
                         className="w-full flex items-center justify-center gap-2 rounded-2xl font-bold py-3 h-auto text-xs shadow-lg shadow-indigo-200/50" 
                         disabled={item.status === 'Sold'}
                         onClick={() => {
                           setSelectedSeller(item.seller);
                           setIsSellerModalOpen(true);
                         }}
                       >
                         <MessageCircle size={14} className="stroke-[2.5]" /> Contact Seller
                       </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sell an Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Item Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Vintage Lamp" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. 50" required />
            <div>
              <label className="block text-sm font-medium text-textMain mb-1.5">Condition</label>
              <select
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl border border-border bg-white p-3 text-sm focus:border-primary focus:outline-none resize-none h-20"
              placeholder="Describe your item..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <ImageUpload 
             label="Item Photo (Optional)" 
             currentImage={formData.imageUrl} 
             onUploadSuccess={(url) => setFormData({...formData, imageUrl: url})} 
          />

          <div className="pt-2 flex justify-end gap-3 z-1 w-full">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitLoading}>List Item</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isSellerModalOpen} onClose={() => setIsSellerModalOpen(false)} title="Seller Contact Details">
        {selectedSeller ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500"><Star size={18} /></div>
              <div className="flex-1"><p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Name</p><p className="text-lg font-bold text-gray-800">{selectedSeller.name}</p></div>
            </div>
            {selectedSeller.email && (
              <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500"><Mail size={18} /></div>
                <div className="flex-1 truncate"><p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Email</p><p className="text-sm font-bold text-gray-800 truncate">{selectedSeller.email}</p></div>
              </div>
            )}
            {selectedSeller.phoneNumber && (
              <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500"><Phone size={18} /></div>
                <div className="flex-1"><p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Phone</p><p className="text-lg font-bold text-gray-800">{selectedSeller.phoneNumber}</p></div>
              </div>
            )}
            {selectedSeller.apartmentNumber && (
              <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500"><Home size={18} /></div>
                <div className="flex-1"><p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Apartment</p><p className="text-base font-bold text-gray-800">Apt {selectedSeller.apartmentNumber}</p></div>
              </div>
            )}
            <div className="pt-4 flex justify-end w-full">
              <Button type="button" variant="secondary" onClick={() => setIsSellerModalOpen(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-textMuted">Seller details not available.</div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default Marketplace;
