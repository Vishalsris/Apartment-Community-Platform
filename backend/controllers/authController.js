const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, password, role, apartmentNumber, phoneNumber } = req.body;
    const email = req.body.email?.toLowerCase();
    
    if (!email || !password || !name) {
      console.log(`❌ Registration failed: Missing required fields`);
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    console.log(`📝 Registering user: ${email}`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`❌ Registration failed: User ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Resident',
      apartmentNumber,
      phoneNumber
    });

    if (user) {
      console.log(`✅ Registration successful: ${email}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartmentNumber: user.apartmentNumber,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        houseType: user.houseType,
        token: generateToken(user._id),
      });
    } else {
      console.log(`❌ Registration failed: Invalid user data`);
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(`❌ Registration error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase();

    if (!email || !password) {
      console.log(`❌ Login failed: Missing email or password`);
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    console.log(`🔑 Login attempt for: ${email}`);

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(`✅ Login successful: ${email}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        apartmentNumber: user.apartmentNumber,
        houseType: user.houseType,
        role: user.role,
        avatarUrl: user.avatarUrl,
        token: generateToken(user._id),
      });
    } else {
      console.log(`❌ Login failed: Invalid email or password for ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(`❌ Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
