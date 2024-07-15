const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/users.v2.json');

exports.getAllUsers = function (req, res) {
    let userArr = [];
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            userArr = JSON.parse(data);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    res.status(200).json(userArr);
}

exports.getUserById = function (req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    let usersArr = [];
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            usersArr = JSON.parse(data);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    const userIndex = usersArr.findIndex(user => user.id === id);

    if (userIndex !== -1) {
        const userResult = usersArr[userIndex];
        res.status(200).json(userResult);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}

exports.registerUser = function (req, res) {
    const newUser = req.body;

    const requiredFields = ['name', 'email', 'password'];
    const bodyKeys = Object.keys(req.body);
    const hasAllRequiredFields = requiredFields.every(field => bodyKeys.includes(field))

    if (!hasAllRequiredFields || bodyKeys.length !== 3) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    let userArr = [];

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            userArr = JSON.parse(data);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    const userIndex = userArr.findIndex(user => user.email === newUser.email);

    if (userIndex !== -1) {
        res.status(409).json({ error: 'User already exists' });
        return;
    } else {
        newUser.id = userArr.length + 1;
        newUser.role = 'user';
        userArr.push(newUser);
        try {
            const newUserJson = JSON.stringify(userArr, null, 2);
            fs.writeFileSync(filePath, newUserJson, 'utf-8');
            res.status(201).json({ email: newUser.email, name: newUser.name });
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

exports.updateUser = function (req, res) {
    const id = Number(req.params.id);

    const requiredFields = ['name', 'email', 'password'];
    const bodyKeys = Object.keys(req.body);
    const hasAllRequiredFields = requiredFields.every(field => bodyKeys.includes(field));

    console.log(hasAllRequiredFields);
    console.log(bodyKeys.length);

    if (!hasAllRequiredFields || bodyKeys.length !== 3) {
        res.status(400).json({ error: 'Invalid request' });
    }

    let usersData = [];
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            usersData = JSON.parse(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }



    const userIndex = usersData.findIndex(user => user.id === id);
    // console.log('user :' + JSON.stringify(usersData[userIndex]));

    usersData[userIndex] = { ...req.body, ...usersData[userIndex] };

    // console.log('usersData:' + JSON.stringify(usersData));

    // console.log(usersData[userIndex] = { ...req.body, ...usersData[userIndex] });

    fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2), 'utf-8');
    res.status(200).json({ message: 'User updated successfully' });

    // console.log(usersData[userIndex]);


}