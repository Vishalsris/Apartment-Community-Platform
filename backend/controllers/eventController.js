const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email phoneNumber apartmentNumber')
      .populate('rsvps.user', 'name email phoneNumber apartmentNumber')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEventRequest = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Parse polls if sent as string from FormData
    let polls = [];
    if (req.body.polls) {
      try {
        polls = typeof req.body.polls === 'string' ? JSON.parse(req.body.polls) : req.body.polls;
      } catch (e) {
        console.error('Failed to parse polls', e);
      }
    }
    
    // Auto-approve if admin creates it, else pending
    const status = req.user.role === 'Admin' ? 'Approved' : 'Pending';

    const imagePath = req.body.image || '';

    const event = await Event.create({
      title,
      description,
      date,
      location,
      polls,
      organizer: req.user.id,
      status,
      image: imagePath
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email phoneNumber apartmentNumber')
      .populate('rsvps.user', 'name email phoneNumber apartmentNumber');

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.status = status;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const voteOnPoll = async (req, res) => {
  try {
    const { pollOptionId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    let voted = false;
    event.polls.forEach(poll => {
      // Remove previous vote if any
      poll.votes = poll.votes.filter(v => v.toString() !== req.user.id.toString());
      if (poll._id.toString() === pollOptionId) {
        poll.votes.push(req.user.id);
        voted = true;
      }
    });

    if (!voted) return res.status(400).json({ message: 'Invalid poll option' });

    await event.save();
    
    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email phoneNumber apartmentNumber')
      .populate('rsvps.user', 'name email phoneNumber apartmentNumber');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const { familyMembers } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    const existingIndex = event.rsvps.findIndex(r => r.user.toString() === req.user.id.toString());
    
    if (existingIndex >= 0) {
      event.rsvps[existingIndex].familyMembers = familyMembers || 0;
    } else {
      event.rsvps.push({ user: req.user.id, familyMembers: familyMembers || 0 });
    }

    // Calculate total attendees: each RSVP is 1 (the user) + familyMembers
    let total = 0;
    event.rsvps.forEach(rsvp => {
      total += 1 + Number(rsvp.familyMembers);
    });
    event.totalAttendees = total;

    await event.save();
    
    // Re-populate and return the event so the frontend gets the latest totalAttendees and user details
    const updatedEvent = await Event.findById(req.params.id)
      .populate('organizer', 'name email phoneNumber apartmentNumber')
      .populate('rsvps.user', 'name email phoneNumber apartmentNumber');
      
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;

    if (req.body.image) {
      event.image = req.body.image;
    }

    const updatedEvent = await event.save();
    
    const populatedEvent = await Event.findById(updatedEvent._id)
      .populate('organizer', 'name email phoneNumber apartmentNumber')
      .populate('rsvps.user', 'name email phoneNumber apartmentNumber');

    res.json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, createEventRequest, updateEventStatus, voteOnPoll, rsvpEvent, updateEvent, deleteEvent };
