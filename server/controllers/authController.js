import User from '../models/User.js'; // <-- Note the .js extension
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Check if a username already exists
export const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        res.json({ exists: !!user }); // Send back true if user exists, false otherwise
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Check if an email already exists
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        res.json({ exists: !!user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Use 'export const' for named exports
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // Changed from 'email' to 'identifier'

        // Check if the identifier is an email or a username
        const isEmail = identifier.includes('@');

        const query = isEmail ? { email: identifier } : { username: identifier };

        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ msg: 'Username or E-mail is not valid' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password is incorrect' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};