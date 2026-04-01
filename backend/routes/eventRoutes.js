const express = require('express');
const router = express.Router();
const { getEvents, createEventRequest, updateEventStatus, voteOnPoll, rsvpEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEventRequest);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.route('/:id/status')
  .put(protect, adminOnly, updateEventStatus);

router.route('/:id/vote')
  .post(protect, voteOnPoll);

router.route('/:id/rsvp')
  .post(protect, rsvpEvent);

module.exports = router;
