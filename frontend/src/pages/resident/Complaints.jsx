import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ImageUpload from '../../components/ui/ImageUpload';
import { Plus, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]); 
  const [localComplaints, setLocalComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Maintenance', proofImage: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');


  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setLocalComplaints(data);
    } catch (error) {
    //  toast.error('Failed to load complaints');
      // For demo fallback
      setLocalComplaints([
        { _id: '1', title: 'Leaking Pipe in Kitchen', category: 'Maintenance', status: 'In Progress', createdAt: new Date().toISOString() },
        { _id: '2', title: 'Loud noise late night', category: 'Noise', status: 'Pending', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const { data } = await axios.post('/api/complaints', formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setLocalComplaints([data, ...localComplaints]);
      toast.success('Complaint submitted successfully');
      toast.success('Complaint submitted successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', category: 'Maintenance', proofImage: '' });
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold">Pending</span>;
      case 'In Progress': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">In Progress</span>;
      case 'Completed': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Completed</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">Complaints & Requests</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Track and manage your community issues.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2.5 font-bold shadow-lg shadow-indigo-200/50 hover:scale-105 transition-all text-base z-10">
          <Plus size={20} className="stroke-[2.5]" /> New Complaint
        </Button>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 font-medium"
            />
          </div>
          <select 
            className="rounded-2xl border border-gray-200 bg-gray-50/50 px-6 py-3.5 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 font-medium md:w-1/4"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <SkeletonLoader type="card" count={3} className="h-24" />
        </div>
      ) : (
        <div className="space-y-4">
          {localComplaints.filter(c => filterStatus === 'All' ? true : c.status === filterStatus).map((complaint, index) => (
            <motion.div
              key={complaint._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-textMuted">{complaint.category}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                    <span className="text-xs text-textMuted">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-textMain">{complaint.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  {complaint.proofImage && (
                    <div className="hidden md:block w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                      <img src={complaint.proofImage} alt="Proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {getStatusBadge(complaint.status)}
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-border flex items-center justify-center text-textMuted hover:bg-primary/10 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {localComplaints.length === 0 && (
            <div className="text-center py-12 text-textMuted">
              No complaints found. You're all good!
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lodge New Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Complaint Title" 
            placeholder="E.g. Leaking pipe in bathroom" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Category</label>
            <select
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Noise">Noise Disturbance</option>
              <option value="Security">Security Issue</option>
              <option value="Billing">Billing & Payment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl border border-border bg-white p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none h-32"
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <ImageUpload 
             label="Proof Photo (Optional)" 
             currentImage={formData.proofImage} 
             onUploadSuccess={(url) => setFormData({...formData, proofImage: url})} 
          />

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitLoading}>Submit Request</Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

export default Complaints;
