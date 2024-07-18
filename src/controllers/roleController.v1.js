const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './../data/roles.json');

exports.getAllRoles = function (req, res) {
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