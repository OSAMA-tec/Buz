// userController.js
const { User } = require('../../Model/User');
const { generatePasswordHash, isPasswordValid } = require('../../Utils/password');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNo, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = generatePasswordHash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNo,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = isPasswordValid(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    let token;
    const payload = { _id: user._id, email: user.email, role: user.role };
    const options = { expiresIn: '30d' };

    if (user.role === 'admin') {
      token = jwt.sign(payload, process.env.secretAdmin, options);
    } else if (user.role === 'driver') {
      token = jwt.sign(payload, process.env.secretDriver, options);
    } else {
      token = jwt.sign(payload, process.env.secretUser, options);
    }

    res.status(200).json({ message: 'Signin successful', token });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signup, signin };