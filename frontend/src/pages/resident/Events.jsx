import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ImageUpload from '../../components/ui/ImageUpload';
import { Plus, Check, Search, Calendar as CalIcon, MapPin, Loader2, Users, Image as ImageIcon, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: '', description: '', date: '', location: '', polls: [], image: ''
  });
  const [pollOption, setPollOption] = useState('');
  const [votingId, setVotingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  
  const [activeEvent, setActiveEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [familyMembersCount, setFamilyMembersCount] = useState(0);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const userInfo = user;
      const filteredEvents = data.filter(e => e.status === 'Approved' || (e.organizer && e.organizer._id === userInfo._id) || userInfo.role === 'Admin');
      setEvents(filteredEvents);
    } catch (error) {
    //  toast.error('Failed to load events');
      setEvents([
        { 
          _id: '1', title: 'Community Association Meeting', description: 'Monthly meetup to discuss community matters and budget.', 
          date: new Date(Date.now() + 86400000).toISOString(), location: 'Main Clubhouse', status: 'Approved', 
          organizer: { name: 'Admin User' }, 
          polls: [
             { _id: 'p1', optionText: 'Morning (10 AM)', votes: ['test1', 'test2'] },
             { _id: 'p2', optionText: 'Evening (6 PM)', votes: ['test3'] }
          ] 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addPollOption = () => {
    if (pollOption.trim()) {
      setFormData({ ...formData, polls: [...formData.polls, { optionText: pollOption }] });
      setPollOption('');
    }
  };

  const removePollOption = (index) => {
    const newPolls = [...formData.polls];
    newPolls.splice(index, 1);
    setFormData({ ...formData, polls: newPolls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        polls: typeof formData.polls === 'string' ? formData.polls : JSON.stringify(formData.polls),
        image: formData.image
      };

      const { data } = await axios.post('/api/events', payload, {
        headers: { 
          Authorization: `Bearer ${user.token}`
        }
      });
      setEvents([data, ...events]);
      toast.success(user.role === 'Admin' ? 'Event created successfully' : 'Event request submitted for approval');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', date: '', location: '', polls: [], image: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleVote = async (eventId, pollOptionId) => {
    setVotingId(pollOptionId);
    try {
      const { data } = await axios.post(`/api/events/${eventId}/vote`, { pollOptionId }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      
      const updatedEvents = events.map(ev => ev._id === eventId ? data : ev);
      setEvents(updatedEvents);
      toast.success('Vote recorded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      const { data } = await axios.post(`/api/events/${activeEvent._id}/rsvp`, { familyMembers: Number(familyMembersCount) }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEvents(events.map(ev => ev._id === activeEvent._id ? data : ev));
      setActiveEvent(data);
      toast.success('RSVP updated successfully!');
      setIsEventModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEvents(events.filter(ev => ev._id !== id));
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative">
        <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 tracking-tight">Community Events</h1>
          <p className="text-gray-500 font-medium mt-2 text-lg tracking-wide">Discover, organize, and vote on community events.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2.5 font-bold shadow-lg shadow-indigo-200/50 hover:scale-105 transition-all text-base z-10">
          <Plus size={20} className="stroke-[2.5]" /> Organize Event
        </Button>
      </motion.div>
      
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 mb-8 relative z-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-50 p-1 rounded-2xl w-full md:w-auto">
          <button 
            className={`flex-1 md:w-48 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All Events
          </button>
          <button 
            className={`flex-1 md:w-48 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'hosted' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('hosted')}
          >
            Hosted By Me
          </button>
        </div>
        <select 
          className="rounded-2xl w-full border border-gray-200 bg-gray-50/50 px-6 py-3.5 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 font-medium md:w-1/4"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending Approval</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-0">
        {loading ? (
          <SkeletonLoader type="card" count={2} className="h-80" />
        ) : (
          events
            .filter(e => filterStatus === 'All' ? true : e.status === filterStatus)
            .filter(e => activeTab === 'all' ? true : e.organizer?._id === user?._id)
            .map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="flex flex-col h-full bg-white relative pb-6 cursor-pointer rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 overflow-hidden" 
                onClick={() => { setActiveEvent(event); setIsEventModalOpen(true); }}
              >
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden group/img">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-indigo-50/50">
                      <ImageIcon size={48} className="opacity-50" />
                    </div>
                  )}
                  {event.status === 'Pending' && (
                    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-md font-bold uppercase z-10 shadow-sm border border-yellow-200">Pending Approval</div>
                  )}
                  {activeTab === 'hosted' && (
                    <div className="absolute top-3 right-3 flex gap-2 z-20">
                      <button onClick={(e) => handleDelete(e, event._id)} className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  {event.organizer && activeTab !== 'hosted' && (
                     <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm font-semibold text-xs flex items-center gap-1.5 text-indigo-700">
                        Hosted by {event.organizer.name}
                     </div>
                  )}
                </div>

                <div className="p-6 pb-0 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                     <span className="flex items-center gap-2"><CalIcon size={16} className="text-indigo-400"/> {new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                     <span className="flex items-center gap-2"><MapPin size={16} className="text-indigo-400"/> {event.location}</span>
                     <span className="flex items-center gap-2 font-bold text-indigo-600 bg-indigo-50 w-max px-2 py-1 rounded-lg border border-indigo-100"><Users size={16} /> {event.totalAttendees || 0} People Attending</span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{event.description}</p>
                </div>
                
                {event.polls && event.polls.length > 0 && (
                  <div className="mt-auto border-t border-gray-100 pt-4 px-6 pb-6 bg-gray-50/50">
                     <h4 className="text-sm font-semibold mb-3 text-gray-900 border-l-4 border-indigo-400 pl-2">Live Community Poll</h4>
                     <div className="space-y-2 relative z-10 w-full pb-[10px]">
                       {event.polls.map((poll) => {
                         const totalVotes = event.polls.reduce((acc, curr) => acc + curr.votes.length, 0);
                         const percentage = totalVotes === 0 ? 0 : Math.round((poll.votes.length / totalVotes) * 100);
                         const isVoted = poll.votes.includes(user?._id || 'test'); // Using generic for demo
                         
                         return (
                           <button 
                             key={poll._id}
                             onClick={(e) => { e.stopPropagation(); handleVote(event._id, poll._id); }}
                             disabled={votingId !== null}
                             className={`w-full relative overflow-hidden rounded-xl border text-left p-2.5 transition-all outline-none focus:ring-2 focus:ring-primary ${isVoted ? 'border-primary bg-indigo-50/50' : 'border-border hover:bg-gray-50'}`}
                           >
                             <div className="absolute top-0 left-0 h-full bg-primary/10 z-0 transition-all duration-1000 ease-out flex" style={{ width: `${percentage}%` }}></div>
                             <div className="relative z-1 flex justify-between items-center text-sm break-keep w-full pr-[10px]">
                                <span className={`font-medium ml-1 ${isVoted ? 'text-primary' : 'text-textMain'}`}>{poll.optionText}</span>
                                <div className="flex items-center gap-2 z-0 min-w-max">
                                  {votingId === poll._id && <Loader2 size={14} className="animate-spin text-primary" />}
                                  {isVoted && <Check size={14} className="text-primary" />}
                                  <span className="text-xs font-semibold text-textMuted min-w-[30px] text-right">{percentage}%</span>
                                </div>
                             </div>
                           </button>
                         )
                       })}
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Organize Community Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Event Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Summer Pool Party" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date & Time" type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Clubhouse" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMain mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl border border-border bg-white p-3 text-sm focus:border-primary focus:outline-none resize-none h-20"
              placeholder="Event details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div>
             <ImageUpload 
               label="Event Cover Image (Optional)" 
               currentImage={formData.image} 
               onUploadSuccess={(url) => setFormData({...formData, image: url})} 
             />
          </div>

          <div className="p-4 bg-gray-50 border border-border rounded-xl">
             <label className="block text-sm font-semibold text-textMain mb-2 z-0 relative">Add a Poll (Optional)</label>
             <p className="text-xs text-textMuted mb-3 z-0 w-full relative">Ask the community for input (e.g., best time, food options).</p>
             <div className="flex gap-2 mb-3 relative z-0 w-full">
               <Input 
                 placeholder="Option text..." 
                 value={pollOption}
                 onChange={(e) => setPollOption(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPollOption())}
                 className="py-2 z-0 w-full flex"
               />
               <Button type="button" onClick={addPollOption} variant="secondary" size="sm" className="whitespace-nowrap px-3 z-0">Add</Button>
             </div>
             
             <AnimatePresence>
               {formData.polls.map((poll, idx) => (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }} 
                   animate={{ opacity: 1, height: 'auto' }} 
                   exit={{ opacity: 0, height: 0 }}
                   key={idx} 
                   className="flex justify-between items-center bg-white p-2 border border-border rounded-lg mb-2 pl-[10px] w-full"
                 >
                   <span className="text-sm font-medium text-textMain w-full z-0 break-words">{poll.optionText}</span>
                   <button type="button" onClick={() => removePollOption(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors w-full z-0 text-center max-w-[20px]"><svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>

          <div className="pt-2 flex justify-end gap-3 z-1 w-full">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={submitLoading}>Submit Event</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Event Details">
        {activeEvent && (
          <div className="space-y-6">
            <div>
              {activeEvent.image && (
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-5">
                   <img src={activeEvent.image} className="w-full h-full object-cover" alt="Event Cover" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeEvent.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 inline-flex w-full">
                <span className="flex items-center gap-1.5"><CalIcon size={16}/> {new Date(activeEvent.date).toLocaleString()}</span>
                <span className="flex items-center gap-1.5"><MapPin size={16}/> {activeEvent.location}</span>
              </div>
              
              {activeEvent.organizer && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4 text-sm">
                  <h4 className="font-bold text-primary mb-1">Host / Organizer</h4>
                  <p className="text-textMain font-medium">{activeEvent.organizer.name} <span className="text-textMuted">(Apt {activeEvent.organizer.apartmentNumber})</span></p>
                  <div className="flex gap-4 mt-2 text-textMuted">
                    <span>{activeEvent.organizer.phoneNumber || 'No phone provided'}</span>
                    <span>{activeEvent.organizer.email}</span>
                  </div>
                </div>
              )}

              <p className="text-textMain bg-gray-50 p-4 rounded-xl border border-border">{activeEvent.description}</p>
            </div>
            
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-bold text-textMain mb-3">RSVP to Event</h3>
              
              {activeEvent.organizer?._id === user?._id || user?.role === 'Admin' ? (
                <div className="bg-gray-50 border border-border p-5 rounded-xl space-y-4 mb-6">
                  <h4 className="font-semibold text-primary flex items-center gap-2">Organizer Dashboard</h4>
                  <p className="text-sm text-textMuted mb-2">Total RSVPs include the user and any additional family members they specify.</p>
                  
                  {activeEvent.rsvps && activeEvent.rsvps.length > 0 ? (
                    <div className="space-y-3 mt-4">
                      {activeEvent.rsvps.map((rsvp, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                          <div>
                            <p className="text-sm font-bold text-textMain">{rsvp.user?.name} <span className="text-xs font-normal text-textMuted">(Apt {rsvp.user?.apartmentNumber})</span></p>
                            <p className="text-xs text-textMuted mt-0.5">Guests: {rsvp.familyMembers}</p>
                          </div>
                          <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                            {1 + Number(rsvp.familyMembers)} Total
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 flex justify-between items-center font-bold text-lg text-textMain mt-2 border-t border-border">
                        <span>Total Attendees:</span>
                        <span className="text-primary">{activeEvent.rsvps.reduce((acc, curr) => acc + 1 + Number(curr.familyMembers), 0)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-textMuted italic">No RSVPs yet.</p>
                  )}
                </div>
              ) : null}

              <form onSubmit={handleRSVP} className="bg-primary/5 border border-primary/20 p-5 rounded-xl space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-textMain mb-2">How many family members are attending (excluding you)?</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="E.g., 2"
                    value={familyMembersCount}
                    onChange={(e) => setFamilyMembersCount(e.target.value)}
                    className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button type="submit" isLoading={rsvpLoading} className="w-full">Confirm RSVP</Button>
                
                {activeEvent.rsvps && activeEvent.rsvps.length > 0 && (
                  <div className="text-sm text-center text-textMuted mt-4 pt-4 border-t border-primary/10">
                    <span className="font-semibold text-primary">{activeEvent.rsvps.length}</span> households have RSVP'd so far.
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default Events;
