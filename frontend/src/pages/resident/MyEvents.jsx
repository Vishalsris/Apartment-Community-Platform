import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Plus, Search, Calendar as CalIcon, MapPin, Trash2, Edit, Users, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', description: '', date: '', location: '', image: null
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const myEvents = data.filter(e => e.organizer && e.organizer._id === userInfo._id);
      setEvents(myEvents);
    } catch (error) {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely delete this event? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setEvents(events.filter(e => e._id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('date', formData.date);
      formPayload.append('location', formData.location);
      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      const { data } = await axios.put(`/api/events/${activeEvent._id}`, formPayload, {
        headers: { 
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEvents(events.map(ev => ev._id === activeEvent._id ? data : ev));
      toast.success('Event updated successfully');
      setIsEditModalOpen(false);
      setActiveEvent(null);
    } catch (error) {
      toast.error('Failed to update event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditModal = (event) => {
    setActiveEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      image: null
    });
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">My Hosted Events</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Manage, edit, and track RSVPs for the events you have created.</p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
        {loading ? (
          <SkeletonLoader type="card" count={3} className="h-80" />
        ) : events.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500">
            You haven't hosted any events yet.
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col h-full bg-white relative overflow-hidden rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1">
                
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden group/img">
                  {event.image ? (
                    <img src={`http://localhost:5000${event.image}`} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-indigo-50/50">
                      <ImageIcon size={48} className="opacity-50" />
                    </div>
                  )}
                  {event.status === 'Pending' && (
                    <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase z-10 shadow-sm border border-yellow-200">Pending Approval</div>
                  )}
                  {event.status === 'Approved' && (
                    <div className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase z-10 shadow-sm border border-emerald-200">Active Listing</div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{event.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                     <span className="flex items-center gap-2"><CalIcon size={16} className="text-indigo-400"/> {new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                     <span className="flex items-center gap-2"><MapPin size={16} className="text-indigo-400"/> {event.location}</span>
                     <span className="flex items-center gap-2 font-bold text-indigo-600 bg-indigo-50 w-max px-2 py-1 rounded-lg border border-indigo-100"><Users size={16} /> {event.totalAttendees || 0} People Attending</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{event.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-2">
                     <Button variant="secondary" size="sm" onClick={() => openEditModal(event)} className="flex items-center gap-1.5"><Edit size={14}/> Edit</Button>
                     <Button variant="secondary" size="sm" onClick={() => handleDelete(event._id)} className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"><Trash2 size={14}/> Delete</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Event Listing">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Event Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date & Time" type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 resize-none h-20 transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Update Event Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors border border-gray-200 rounded-xl mb-3"
            />
            {formData.image && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative">
                   <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-sm z-10">Preview</span>
                   <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="Preview" />
                </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 z-1 w-full border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitLoading}>Save Changes</Button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

export default MyEvents;
