import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ImageUpload from '../../components/ui/ImageUpload';
import { Plus, Search, MapPin, Phone, Globe, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BusinessDirectory = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', description: '', category: 'Services', contactEmail: '', contactPhone: '', website: '', logoUrl: ''
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
    //  toast.error('Failed to load businesses');
      setBusinesses([
        { _id: '1', name: 'Elite Home Cleaning', category: 'Services', description: 'Professional deep cleaning for apartments.', contactPhone: '(555) 123-4567', contactEmail: 'contact@elitecleaning.com' },
        { _id: '2', name: 'Fresh Bites Bakery', category: 'Food & Dining', description: 'Freshly baked goods delivered to your door every morning.', contactPhone: '(555) 987-6543', contactEmail: 'orders@freshbites.com' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const { data } = await axios.post('/api/businesses', formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setBusinesses([data, ...businesses]);
      toast.success('Business listed successfully');
      setIsModalOpen(false);
      setFormData({ name: '', description: '', category: 'Services', contactEmail: '', contactPhone: '', website: '', logoUrl: '' });
    } catch (error) {
      toast.error('Failed to add business');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textMain">Business Directory</h1>
          <p className="text-textMuted mt-1">Discover internal services and local businesses.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> List Your Business
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
        <input 
          type="text" 
          placeholder="Search for services, food, retail..." 
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-white shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {loading ? (
          <SkeletonLoader type="card" count={3} className="h-72 rounded-3xl" />
        ) : businesses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-textMuted text-lg font-medium">No approved businesses found in the directory.</p>
          </div>
        ) : (
          businesses.map((business, index) => (
            <motion.div
              key={business._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => {
                setSelectedBusiness(business);
                setIsDetailsModalOpen(true);
              }}
              className="cursor-pointer"
            >
              <Card className="flex flex-col h-full relative overflow-hidden group border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-[2.5rem] p-8" hoverEffect={true}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`h-20 w-20 rounded-3xl overflow-hidden shadow-xl border-4 border-white ${!business.logoUrl && 'bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'}`}>
                      {business.logoUrl ? (
                        <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-black text-3xl uppercase">{business.name.charAt(0)}</span>
                      )}
                  </div>
                  <span className="px-4 py-1.5 bg-white text-primary border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {business.category}
                  </span>
                </div>
                
                <div className="relative z-10 flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">{business.name}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">{business.description}</p>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    {business.contactPhone && (
                      <div className="flex items-center text-sm font-bold text-gray-700 gap-3 group/item">
                        <div className="p-2 bg-indigo-50 rounded-xl group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <Phone size={14} className="stroke-[2.5]" />
                        </div>
                        {business.contactPhone}
                      </div>
                    )}
                    {business.contactEmail && (
                      <div className="flex items-center text-sm font-bold text-gray-700 gap-3 group/item">
                        <div className="p-2 bg-indigo-50 rounded-xl group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                          <Mail size={14} className="stroke-[2.5]" />
                        </div>
                        <span className="truncate">{business.contactEmail}</span>
                      </div>
                    )}
                    {business.website && (
                      <a 
                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-extrabold text-primary gap-3 hover:gap-4 transition-all"
                      >
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <Globe size={14} className="stroke-[2.5]" />
                        </div>
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="List Your Business">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Business Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Fresh Bites Bakery" required />
          
          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Category</label>
            <select
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Services">Home Services</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Retail">Retail</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl border border-border bg-white p-4 text-sm focus:border-primary focus:outline-none resize-none h-24"
              placeholder="What does your business do?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone (Optional)" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} placeholder="(555) 000-0000" />
            <Input label="Email Address" type="email" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} required />
          </div>

          <ImageUpload 
             label="Business Logo (Optional)" 
             currentImage={formData.logoUrl} 
             onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} 
          />

          <div className="pt-4 flex justify-end gap-3 z-10 w-full">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitLoading}>Add Listing</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Business Details">
        {selectedBusiness && (
          <div className="space-y-6">
             <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <div className={`h-24 w-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white ${!selectedBusiness.logoUrl && 'bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'}`}>
                    {selectedBusiness.logoUrl ? (
                      <img src={selectedBusiness.logoUrl} alt={selectedBusiness.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-4xl uppercase">{selectedBusiness.name.charAt(0)}</span>
                    )}
                </div>
                <div>
                   <h2 className="text-2xl font-black text-gray-900">{selectedBusiness.name}</h2>
                   <span className="inline-block px-3 py-1 mt-2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {selectedBusiness.category}
                   </span>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">About this business</h3>
                <p className="text-gray-600 leading-relaxed">{selectedBusiness.description}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="space-y-4">
                   <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Contact Information</h4>
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-700 font-bold">
                         <Phone size={16} className="text-primary" />
                         {selectedBusiness.contactPhone || 'N/A'}
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 font-bold">
                         <Mail size={16} className="text-primary" />
                         {selectedBusiness.contactEmail}
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Owner Details</h4>
                   <div className="space-y-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <div className="text-gray-900 font-black">{selectedBusiness.owner?.name || 'Unknown Resident'}</div>
                      <div className="text-indigo-600 font-bold flex items-center gap-2">
                         <MapPin size={14} />
                         Apartment {selectedBusiness.owner?.apartmentNumber || 'N/A'}
                      </div>
                   </div>
                </div>
             </div>

             {selectedBusiness.website && (
                <div className="pt-4">
                    <a 
                      href={selectedBusiness.website.startsWith('http') ? selectedBusiness.website : `https://${selectedBusiness.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      <Globe size={18} className="mr-2" /> Visit Official Website
                    </a>
                </div>
             )}
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default BusinessDirectory;
