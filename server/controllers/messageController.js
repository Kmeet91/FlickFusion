import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            subject,
            message,
        });

        await newMessage.save();
        res.status(201).json({ msg: 'Message sent successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};