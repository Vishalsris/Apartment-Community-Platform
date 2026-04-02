import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { Calendar, MapPin, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Modal from '../../components/ui/Modal';
import { Users } from 'lucide-react';

const EventApprovals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setEvents(data);
    } catch (error) {
     // toast.error('Failed to load events');
      setEvents([
        { 
          _id: '1', title: 'Summer Pool Party', description: 'Resident organized pool party. Expecting 20 people.', 
          date: new Date(Date.now() + 86400000 * 5).toISOString(), location: 'Community Pool', status: 'Pending', 
          organizer: { name: 'John Doe', apartmentNumber: 'C-501' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/events/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` }
      });
      setEvents(events.map(ev => ev._id === id ? { ...ev, status } : ev));
      toast.success(status === 'Approved' ? 'Event successfully approved' : 'Event rejected');
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const pendingEvents = events.filter(e => e.status === 'Pending');
  const pastEvents = events.filter(e => e.status !== 'Pending');

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">Event Approvals</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Review and manage resident event requests.</p>
        </div>
      </motion.div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-textMain mb-4 flex items-center gap-2">
            Pending Requests <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">{pendingEvents.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <SkeletonLoader type="card" count={2} className="h-64" />
            ) : pendingEvents.length > 0 ? (
              pendingEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col h-full bg-white rounded-3xl border border-orange-100 shadow-[0_20px_40px_-15px_rgba(255,165,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(255,165,0,0.2)]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-textMain mb-1">{event.title}</h3>
                        <p className="text-xs text-textMuted">Requested by {event.organizer?.name} (Apt {event.organizer?.apartmentNumber || 'N/A'})</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center text-sm text-textMain gap-2 bg-white/50 p-2 rounded-lg border border-white">
                        <Calendar size={16} className="text-primary"/> 
                        <span className="font-semibold">{new Date(event.date).toLocaleDateString()}</span> at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center text-sm text-textMain gap-2 bg-white/50 p-2 rounded-lg border border-white">
                        <MapPin size={16} className="text-primary"/> 
                        <span className="font-semibold">{event.location}</span>
                      </div>
                      <p className="text-sm text-textMuted mt-4 px-1">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <Button variant="danger" className="w-full flex justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600" onClick={() => updateStatus(event._id, 'Rejected')}>
                        <X size={16}/> Reject
                      </Button>
                      <Button variant="primary" className="w-full flex justify-center gap-2 bg-green-500 hover:bg-green-600 focus:ring-green-500" onClick={() => updateStatus(event._id, 'Approved')}>
                        <Check size={16}/> Approve
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div className="col-span-full py-10 text-center text-textMuted bg-white border border-dashed border-border rounded-xl">
                 No pending event requests.
               </div>
            )}
          </div>
        </section>

        <section>
           <h2 className="text-xl font-bold text-textMain mb-4">Recent History</h2>
           <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b border-border text-textMuted font-semibold">
                 <tr>
                   <th className="py-3 px-6">Event</th>
                   <th className="py-3 px-6">Date</th>
                   <th className="py-3 px-6 text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {pastEvents.length > 0 ? (
                    pastEvents.map(event => (
                      <tr key={event._id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-6 font-medium text-textMain">{event.title}</td>
                        <td className="py-3 px-6 text-textMuted">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            {event.status === 'Approved' && (
                              <button 
                                onClick={() => { setActiveEvent(event); setIsEventModalOpen(true); }}
                                className="text-primary hover:text-indigo-700 text-xs font-bold px-3 py-1 bg-indigo-50 rounded-lg flex items-center gap-1 transition-colors outline-none"
                              >
                                <Users size={14}/> RSVPs ({event.rsvps ? event.rsvps.length : 0})
                              </button>
                            )}
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              new Date(event.date) < new Date() && event.status === 'Approved' 
                                ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                : event.status === 'Approved' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {new Date(event.date) < new Date() && event.status === 'Approved' ? 'Finished' : event.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-6 text-center text-textMuted">No history available.</td>
                    </tr>
                  )}
               </tbody>
              </table>
           </div>
        </section>

      </div>

      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={`RSVPs: ${activeEvent?.title}`}>
        {activeEvent && (
          <div className="space-y-4">
             <div className="bg-gray-50 border border-border p-5 rounded-xl mb-4">
               <h4 className="font-semibold text-textMain mb-2">Organizer</h4>
               <p className="text-sm text-textMuted">{activeEvent.organizer?.name} (Apt {activeEvent.organizer?.apartmentNumber})</p>
             </div>
             
             <h4 className="font-bold text-textMain border-b border-border pb-2">Attendee List</h4>
             
             {activeEvent.rsvps && activeEvent.rsvps.length > 0 ? (
               <div className="space-y-3">
                 {activeEvent.rsvps.map((rsvp, idx) => (
                   <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                     <div>
                       <p className="text-sm font-bold text-textMain">{rsvp.user?.name} <span className="text-xs font-normal text-textMuted">(Apt {rsvp.user?.apartmentNumber})</span></p>
                       <p className="text-xs text-textMuted mt-0.5">{rsvp.familyMembers} Family Members</p>
                     </div>
                     <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                       <Users size={14} /> {1 + Number(rsvp.familyMembers)}
                     </div>
                   </div>
                 ))}
                 <div className="pt-4 flex justify-between items-center font-bold text-lg text-textMain mt-4 border-t border-border px-2">
                   <span>Total Headcount:</span>
                   <span className="text-primary text-xl">{activeEvent.rsvps.reduce((acc, curr) => acc + 1 + Number(curr.familyMembers), 0)}</span>
                 </div>
               </div>
             ) : (
               <p className="text-sm text-textMuted italic text-center py-8 bg-gray-50 rounded-xl">No RSVPs have been submitted yet.</p>
             )}
             
             <div className="pt-4 flex justify-end">
               <Button variant="secondary" onClick={() => setIsEventModalOpen(false)}>Close List</Button>
             </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default EventApprovals;
