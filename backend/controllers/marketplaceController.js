const MarketplaceItem = require('../models/MarketplaceItem');

const getMarketplaceItems = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { approvalStatus: 'Approved' };
    const items = await MarketplaceItem.find(filter).populate('seller', 'name email apartmentNumber phoneNumber').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMarketplaceItem = async (req, res) => {
  try {
    const { title, description, price, condition, imageUrl } = req.body;
    
    const item = await MarketplaceItem.create({
      title,
      description,
      price,
      condition,
      imageUrl,
      seller: req.user.id,
      approvalStatus: 'Pending'
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMarketplaceItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.seller.toString() !== req.user.id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    item.status = status;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMarketplaceItemApprovalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    console.error('Error updating marketplace item approval status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getMarketplaceItems, 
  createMarketplaceItem, 
  updateMarketplaceItemStatus,
  updateMarketplaceItemApprovalStatus 
};
