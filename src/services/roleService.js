const fs = require('fs');
const path = require('path');
const rolesData = require('./../data/roles.json')
const roleFilePath = path.join(__dirname, './../data/roles.json');

exports.getAllUsers = () => {
    try{
        let rolesData;
        const data = fs.readFileSync(roleFilePath, 'utf-8');
        if(!data){
            throw new Error ('Error when reading file')
        }
        rolesData = JSON.parse(data);
        return rolesData;
    }catch(error){
        throw error;
    }
};

exports.getRoleById = (roleId) => {
    try {
        const rolesData = getAllUsers();
        const role = rolesData.find(role => role.id == roleId);
        if (!role) {
            throw new Error(`Role with id ${roleId} not found`);
        }
        return role;
    } catch (error) {
        console.error('Error getting role by id:', error);
        throw error;
    }
};

exports.saveRole = (role) => {
    // const rolesData = this.getAllUsers();
    const newRolesData = JSON.stringify(role, null, 2)
    fs.writeFileSync(roleFilePath, newRolesData, 'utf-8');
};

