const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role, name, email, phoneNumber, apartmentNumber, houseType } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (apartmentNumber !== undefined) user.apartmentNumber = apartmentNumber;
    if (houseType !== undefined) user.houseType = houseType;

    await user.save();
    res.json({ 
      message: 'User updated successfully', 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        apartmentNumber: user.apartmentNumber,
        houseType: user.houseType
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.apartmentNumber = req.body.apartmentNumber || user.apartmentNumber;
    user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      apartmentNumber: updatedUser.apartmentNumber,
      phoneNumber: updatedUser.phoneNumber,
      houseType: updatedUser.houseType,
      avatarUrl: updatedUser.avatarUrl,
      token: req.headers.authorization.split(' ')[1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const residents = await User.find({ role: 'Resident' });
    const totalResidents = residents.length;
    const totalRental = residents.filter(u => u.houseType === 'Rental').length;
    
    res.json({
      totalResidents,
      totalRental,
      totalOwn: totalResidents - totalRental
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUserRole, deleteUser, updateUserProfile, getUserStats };
