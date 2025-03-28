const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN && password === process.env.PASSWORD) {
        return res.status(200).json({ adminkey: true });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
