const e = require('express');
const users = require('./../data/users.json');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/users.json');

exports.getAllUsers = function(req, res){
    res.status(200).json(users);
}

exports.createUser = function(req, res){
    const newUser = req.body;
    let usersArr = [];

    try{
        const data = fs.readFileSync(filePath,'utf-8');
        console.log('Data:', data);
        if(data){
            usersArr = JSON.parse(data);
        }
    }catch(err){
        console.error('Error reading file:', err);
        res.status(500).json({error:'Internal server error'});
        return;
    }
    usersArr.push(newUser);
    try {
        const newUserJson = JSON.stringify(usersArr, null, 2);
        console.log('New user:', newUserJson);
        fs.writeFileSync(filePath, newUserJson, 'utf-8');
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getUserById = function(req, res){
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    console.log('User:', user);
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404).json({error:'User not found'});
    }
}

exports.updateUser = function(req, res){
    const id = Number(req.params.id);

    // Read the users from the file
    let usersData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        usersData = JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    const user = usersData.find(user => user.id === id);
    
    console.log('User:', user);
    if(!user){
        res.status(404).json({error:'User not found'});
        return;
    }

    const LeftUsers = usersData.filter(user => user.id !== id);
    console.log('Left users:', LeftUsers);
    try{
        const LeftUsersJson = JSON.stringify(LeftUsers, null, 2);
        console.log('Left users:', LeftUsersJson);
        fs.writeFileSync(filePath, LeftUsersJson, 'utf-8');
        res.status(204).end();
    }catch(err){
        console.error('Error writing file:', err);
        res.status(500).json({error:'Internal server error'});
    }
}

exports.deleteUser = function(req, res){
    const id = Number(req.params.id);
    if(isNaN(id)){
        res.status(400).json({error:'Invalid ID'});
        return;
    }

    // Read the users from the file
    let usersData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        usersData = JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }

    const userIndex = usersData.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove the user from the array
    usersData.splice(userIndex, 1);

    try {
        const updatedUsersJson = JSON.stringify(usersData, null, 2);
        fs.writeFileSync(filePath, updatedUsersJson, 'utf-8');
        return res.status(204).end();
    } catch (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}