const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/users.json');

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


    // console.log(data)


    const user = usersData.find(user => user.email === loginRequest.email && user.password === loginRequest.password);



    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized'
        });
    }
    console.log(user);

    const userLoginResponse = {
        id: user.id,
        email: user.email,
        token: 'newToken'
    }

    return res.status(200).json({
        success: true,
        data: userLoginResponse
    });
};