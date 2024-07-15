const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/users.json');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./../config/config')

exports.signin = function (req, res) {
    const loginRequest = req.body;
    let usersData = [];

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            usersData = JSON.parse(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error when reading file' });
        return;
    }

    const user = usersData.find(user => user.email === loginRequest.email && user.password === loginRequest.password);
    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }

    const token = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        secretKey,
        {expiresIn:'1h'}
    );

    const userLoginResponse = {
        id: user.id,
        email: user.email,
        token: token
    }

    return res.status(200).json({
        success: true,
        data: userLoginResponse
    });
};