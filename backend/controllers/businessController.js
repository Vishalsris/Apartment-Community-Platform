const Business = require('../models/Business');

const getBusinesses = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { approvalStatus: 'Approved' };
    const businesses = await Business.find(filter).populate('owner', 'name').sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBusiness = async (req, res) => {
  try {
    const { name, description, category, contactEmail, contactPhone, website, logoUrl } = req.body;
    
    const business = await Business.create({
      name,
      description,
      category,
      contactEmail,
      contactPhone,
      website,
      logoUrl,
      owner: req.user.id,
      approvalStatus: 'Pending'
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBusinessStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status },
      { new: true }
    );

    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (error) {
    console.error('Error updating business status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBusinesses, createBusiness, updateBusinessStatus };
