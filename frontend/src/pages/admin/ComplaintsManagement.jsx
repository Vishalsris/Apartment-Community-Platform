import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Search, Filter, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setComplaints(data);
    } catch (error) {
    //  toast.error('Failed to load complaints');
      setComplaints([
        { _id: '1', title: 'Leaking Pipe in Kitchen', category: 'Maintenance', status: 'Pending', createdAt: new Date().toISOString(), user: { name: 'Alice Smith', apartmentNumber: 'B-302' } },
        { _id: '2', title: 'Loud noise late night', category: 'Noise', status: 'In Progress', createdAt: new Date().toISOString(), user: { name: 'Bob Johnson', apartmentNumber: 'A-105' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setComplaints(complaints.map(c => c._id === id ? { ...c, status } : c));
      toast.success(`Complaint marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"><Clock size={12}/> Pending</span>;
      case 'In Progress': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"><Clock size={12}/> In Progress</span>;
      case 'Completed': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"><CheckCircle size={12}/> Completed</span>;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">Manage Complaints</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Review and update resident issues and feedback.</p>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, resident, or apartment..." 
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 font-medium"
            />
          </div>
          <Button variant="secondary" className="flex items-center justify-center gap-2 rounded-2xl px-6 font-bold shadow-sm">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-border text-textMuted font-semibold">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Resident</th>
                <th className="py-4 px-6 whitespace-nowrap">Complaint Details</th>
                <th className="py-4 px-6 whitespace-nowrap">Date</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="px-6 py-4">
                      <SkeletonLoader type="text" count={1} className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-textMain">{complaint.user?.name}</div>
                      <div className="text-xs text-textMuted">Apt {complaint.user?.apartmentNumber}</div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-textMuted">{complaint.category}</span>
                      </div>
                      <div className="font-medium text-textMain truncate">{complaint.title}</div>
                    </td>
                    <td className="py-4 px-6 text-textMuted text-xs whitespace-nowrap">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          className="bg-white border border-border text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary shadow-sm"
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button className="p-1.5 text-textMuted hover:text-primary transition-colors bg-white border border-border rounded-lg shadow-sm">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-textMuted">No complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintsManagement;
