const Complaint = require('../models/Complaint');

// @desc    Get all complaints (Admin gets all, Resident gets own)
// @route   GET /api/complaints
const getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'Admin') {
      complaints = await Complaint.find().populate('user', 'name email apartmentNumber').sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a complaint
// @route   POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, proofImage } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      category,
      proofImage,
      user: req.user.id
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
const updateComplaint = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    complaint.resolutionNotes = resolutionNotes || complaint.resolutionNotes;
    
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComplaints, createComplaint, updateComplaint };
