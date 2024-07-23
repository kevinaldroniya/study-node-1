const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/roles.json');
const usersFilePath = path.join(__dirname, './../data/users.json');
const userController = require('./userController.v2')

exports.getAllRoles = (req, res) => {
    let rolesData;
    const role = req.role;
    const allowedRoles = ['superadmin', 'admin'];

    if (!allowedRoles.includes(role)) {
        return res.status(403)
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            rolesData = JSON.parse(data);
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error'
        });
    }

    return res.status(200).json({
        success: true,
        data: rolesData
    })
};


exports.getRoleById = function (req, res) {
    const reqId = Number(req.params.id);
    const reqUserRole = req.role;
    const allowedRoles = ['superadmin', 'admin'];

    if (!allowedRoles.includes(reqUserRole)) {
        return res.status(403);
    }

    let roleData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            roleData = JSON.parse(data);
        }
    } catch (error) {
        return res.status(500)
    }

    const role = roleData.find(role => role.id === reqId);
    if (!role) {
        return res.status(404).json({
            error: `role with given id: ${req.params.id}, is not found`
        });
    }

    return res.status(200).json({
        success: true,
        data: role
    });
};

exports.createRole = function (req, res) {
    let newRole = req.body
    const userReqRole = req.role;
    const allowedRoles = ['superadmin'];

    const requiredField = ['role'];
    const reqBody = Object.keys(newRole);
    const hasAllRequiredFields = requiredField.every(field => reqBody.includes(field));

    if (!hasAllRequiredFields || reqBody.length != 1) {
        return res.status(400).json({
            error: 'Bad Request'
        })
    }


    if (!allowedRoles.includes(userReqRole)) {
        return res.status(403)
    }

    let rolesData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            rolesData = JSON.parse(data);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    const role = rolesData.find(role => role.role === newRole.role)
    if (role) {
        return res.status(409).json({
            error: `${req.body.role} is already exists`
        });
    }
    newRole.id = rolesData.length + 1;
    rolesData.push(newRole);
    return res.status(201).json({
        success: true,
        data: newRole
    });
};


exports.updateRole = function (req, res) {
    let updateRole = req.body;
    const updateRoleId = Number(req.params.id);
    const roleUserReq = req.role;
    const allowedRoles = ['superadmin'];

    if (!allowedRoles.includes(roleUserReq)) {
        return res.status(403);
    }

    const requiredField = ['role'];
    const reqBody = Object.keys(updateRole);
    const hasAllRequiredFields = requiredField.every(field => reqBody.includes(requiredField));

    if (!hasAllRequiredFields || reqBody.length != 1) {
        return res.status(400).json({
            error: 'Bad Request'
        });
    }

    let rolesData;
    const data = fs.readFileSync(filePath, 'utf-8');
    rolesData = JSON.parse(data);

    const roleIndex = rolesData.findIndex(role => role.id === updateRoleId);

    if (roleIndex == -1) {
        return res.status(404).json({
            error: `role with given id ${req.params.id} is not found`
        });
    }
    rolesData[roleIndex] = { ...rolesData[roleIndex], ...updateRole };

    fs.writeFileSync(filePath, JSON.stringify(rolesData, null, 2), 'utf-8');
    return res.status(200).json({
        success: true,
        message: 'role has updated successfully'
    })
};

exports.deleteRoleById = function (req, res) {
    const reqRoleId = req.params.id;
    const userReqRole = req.role;
    const allowedRoles = ['superadmin'];

    if (!allowedRoles.includes(userReqRole)) {
        return res.status(403).json({
            error: 'Forbidden'
        });
    }

    let rolesData;
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (data) {
            rolesData = JSON.parse(data);
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error'
        });
    }

    roleIndex = rolesData.findIndex(role => role.id === reqRoleId);

    if (roleIndex == -1) {
        return res.status(404).json({
            error: `role with given id: ${req.params.id}, is not found`
        });
    }

    rolesData.splice(roleIndex, 1);

    const rolesDataLeft = JSON.stringify(rolesData, null, 2);
    fs.writeFileSync(filePath, rolesDataLeft, 'utf-8');
    return res.status(200);
};

exports.getUserRole = function (req, res) {
    const paramUserId = Number(req.params.userId);

    if (isNaN(paramUserId)) {
        return res.status(400).json({
            error: 'Bad Request'
        });
    }
    const userRoleReq = req.role;
    const allowedRoles = ['superadmin', 'admin'];

    console.log(allowedRoles.includes(userRoleReq))
    if (!allowedRoles.includes(userRoleReq)) {
        return res.status(403);
    }

    let usersData;
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        usersData = JSON.parse(data);
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error'
        });
    }

    const user = usersData.find(user => user.id === paramUserId);

    if (!user) {
        return res.status(404).json({
            error: `user with given id: ${paramUserId}, is not found`
        });
    }

    const userRole = user.role;
    return res.status(200).json({
        role: userRole
    });
};

exports.assignRoletoUser = async (req, res) => {
    const paramUserId = Number(req.params.userId);
    const getUserReq = {
        params: { id: paramUserId }
    }
    const userResult = await userController.getUserById(getUserReq, res);

    const status = userResult.res.status;

    console.log({ status });
}