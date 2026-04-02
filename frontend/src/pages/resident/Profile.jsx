import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ImageUpload from '../../components/ui/ImageUpload';
import { Mail, Home, Phone, Camera, ShieldCheck, Settings, Bell, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    apartmentNumber: user?.apartmentNumber || '',
    avatarUrl: user?.avatarUrl || '',
    houseType: user?.houseType || 'Own House'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        apartmentNumber: user.apartmentNumber || '',
        avatarUrl: user.avatarUrl || '',
        houseType: user.houseType || 'Own House'
      });
    }
  }, [user]);

  const { updateUser } = useAuth();
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      updateUser(data);
      toast.success('Profile updated successfully!', { icon: '✨' });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

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
      <div className="mb-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight flex items-center gap-3">
             Member Profile
          </h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Manage your elegant identity and preferences.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Identity Card (Luxurious Left Column) */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] group">
              <div className="h-40 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 w-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold tracking-widest flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={14} /> {user?.role || 'Resident'}
                </div>
              </div>
              
              <div className="px-8 pb-8 flex flex-col items-center relative z-10 w-full">
                <div className="relative -mt-20 mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="h-36 w-36 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-white to-gray-50 flex items-center justify-center text-5xl font-extrabold text-indigo-900 overflow-hidden relative group/avatar">
                     {user?.avatarUrl ? (
                         <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                     ) : (
                         <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 z-10">{user?.name?.charAt(0).toUpperCase()}</span>
                     )}
                   </div>
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">{user?.name}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                   <Star size={14} className="fill-indigo-600" /> Premium Member
                </div>

                <div className="w-full mt-8 space-y-5">
                  <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Email</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {user?.apartmentNumber && (
                     <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                         <Home size={18} />
                       </div>
                       <div className="flex-1">
                         <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Residence</p>
                         <p className="text-sm font-bold text-gray-800">Apt {user?.apartmentNumber}</p>
                       </div>
                     </div>
                  )}

                  {user?.phoneNumber && (
                     <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                         <Phone size={18} />
                       </div>
                       <div className="flex-1">
                         <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Direct Line</p>
                         <p className="text-sm font-bold text-gray-800">{user?.phoneNumber}</p>
                       </div>
                     </div>
                  )}

                  <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                      <Settings size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mb-0.5">Occupancy</p>
                      <p className="text-sm font-bold text-gray-800 uppercase">{user?.houseType || 'Own House'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Column */}
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
            <Card className="p-8 border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] bg-white rounded-3xl" hoverEffect={false}>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                     <Settings size={28} className="text-indigo-400" />
                     Account Preferences
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium tracking-wide">Update your personal details and app settings.</p>
                </div>
                <Button 
                  variant={isEditing ? 'secondary' : 'primary'} 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`rounded-full px-6 font-bold shadow-lg shadow-indigo-200/50 transition-all duration-300 ${!isEditing ? 'hover:scale-105' : ''}`}
                >
                  {isEditing ? 'Discard' : 'Edit Profile'}
                </Button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Input
                      label="Full Legal Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50 focus:bg-white border-gray-200 py-3 rounded-2xl transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      label="Primary Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="bg-gray-50/50 focus:bg-white border-gray-200 py-3 rounded-2xl transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      label="Mobile Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditing}
                      className="bg-gray-50/50 focus:bg-white border-gray-200 py-3 rounded-2xl transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      label="Suite / Unit Designation"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={handleChange}
                      disabled={!isEditing || user?.role === 'Admin'}
                      className={`bg-gray-50/50 focus:bg-white border-gray-200 py-3 rounded-2xl transition-all font-medium text-gray-500 ${!isEditing || user?.role === 'Admin' ? 'cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="w-full border-t border-gray-100 pt-6 mt-6">
                    <ImageUpload 
                      label="Upload New Profile Avatar" 
                      currentImage={formData.avatarUrl} 
                      onUploadSuccess={(url) => setFormData({...formData, avatarUrl: url})} 
                    />
                  </div>
                )}

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      className="pt-8 border-t border-gray-100 flex justify-end gap-3 mt-8"
                    >
                      <Button type="submit" className="rounded-full px-10 py-3 font-bold text-md shadow-xl shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all w-full md:w-auto">
                         Save Configuration
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Card>

            <Card className="p-8 border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden relative" hoverEffect={false}>
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
               <div className="absolute right-20 top-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: "2s" }}></div>
               <div className="relative z-10 flex items-start gap-5">
                 <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-500">
                    <Bell size={24}/>
                 </div>
                 <div>
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-2">Notification Preferences</h3>
                    <p className="text-gray-600 font-medium leading-relaxed max-w-lg">
                      Stay connected with your community. Opt-in to receive premium alerts for marketplace updates, social events, and crucial service notifications.
                    </p>
                    <button className="mt-5 font-bold text-sm text-indigo-600 hover:text-indigo-800 uppercase tracking-widest border-b-2 border-indigo-200 hover:border-indigo-600 transition-colors pb-1">Configure Alerts</button>
                 </div>
               </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
