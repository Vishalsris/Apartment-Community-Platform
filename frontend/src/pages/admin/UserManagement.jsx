import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Users, ShieldCheck, Mail, Phone, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', phoneNumber: '', apartmentNumber: '', role: 'Resident', houseType: 'Own House' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const { data } = await axios.put(`/api/users/${selectedUser._id}`, editData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setUsers(users.map(u => u._id === selectedUser._id ? { ...u, ...data.user } : u));
      toast.success(data.message);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to completely remove this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setUsers(users.filter(u => u._id !== id));
      toast.success('User removed successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 relative">
          <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight flex items-center gap-3">
            <Users size={36} className="text-indigo-600" />
            User Management
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Manage resident accounts, assign admin privileges, and moderate users.</p>
        </motion.div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-5">Resident Name</th>
                  <th className="px-6 py-5">Contact Details</th>
                  <th className="px-6 py-5">Role / Status</th>
                  <th className="px-6 py-5">Apartment</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8"><SkeletonLoader count={5} type="title" /></td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      key={u._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 font-medium"><Mail size={14} /> {u.email}</div>
                        {u.phoneNumber && <div className="flex items-center gap-2 text-gray-500 font-medium"><Phone size={14} /> {u.phoneNumber}</div>}
                      </td>
                      <td className="px-6 py-5">
                        {u.role === 'Admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs tracking-wide">
                            <ShieldCheck size={14} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg text-xs tracking-wide">
                            <Users size={14} /> Resident
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-gray-700">{u.apartmentNumber ? `Apt ${u.apartmentNumber}` : '-'}</div>
                        <div className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{u.houseType || 'Own House'}</div>
                      </td>
                      <td className="px-6 py-5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setEditData({ name: u.name, email: u.email, phoneNumber: u.phoneNumber || '', apartmentNumber: u.apartmentNumber || '', role: u.role, houseType: u.houseType || 'Own House' });
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block"
                          title="Edit User"
                          disabled={u._id === user._id}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="Remove User"
                          disabled={u._id === user._id}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
                {!loading && users.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update User Information">
        {selectedUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50"
                  value={editData.phoneNumber}
                  onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Apt Number</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50"
                  value={editData.apartmentNumber}
                  onChange={(e) => setEditData({ ...editData, apartmentNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Assign New Role</label>
                <select
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 font-medium"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                >
                  <option value="Resident">Resident</option>
                  <option value="Admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Admins have full access.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">House Type</label>
                <select
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 font-medium"
                  value={editData.houseType}
                  onChange={(e) => setEditData({ ...editData, houseType: e.target.value })}
                >
                  <option value="Own House">Own House</option>
                  <option value="Rental">Rental</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Specify ownership status.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={updateLoading}>Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default UserManagement;
