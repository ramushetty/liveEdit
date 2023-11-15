
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // You need to create this

exports.registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { ...req.body, password: hashedPassword };

        await userModel.createUser(user); // Save user to the database

        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await userModel.findUserByEmail(req.body.email);
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' }); // Replace 'SECRET_KEY' with a real secret key
            res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
