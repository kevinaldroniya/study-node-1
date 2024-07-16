const fs = require('fs');
const roleController = require('./../../controllers/roleController.v1');

jest.mock('fs');

describe('getAllRoles', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' }
    ];

    let req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    beforeEach(() => {
        jest.clearAllMocks();

    });

    it('should return 200 and show all roles', () => {
        req = {
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }
        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));

        roleController.getAllRoles(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockRoles
        });
    });

    it('should return 500 if file read error', () => {
        req = {
            id: 1,
            email: 'test1@example.com',
            role: 'admin'
        }
        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error reading file')
        });

        roleController.getAllRoles(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        });
    })

    it('should return 403 if user role is not admin or superadmin', () => {
        req = {
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.getAllRoles(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    })
});

describe('getRoleById', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' }
    ];

    let req = {}

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should return 200 and get user by id', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'admin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));

        const role = mockRoles.find(role => role.id = req.params.id);

        roleController.getRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: role
        })
    });

    it('should return 500 if file read error', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'admin'
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error reading file')
        });

        roleController.getRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 403 if role is not allowed', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.getRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});

describe('createRole', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' }
    ];

    let req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and create new role', () => {
        req = {
            body: {
                role: 'newRole'
            },
            id: 1,
            email: 'test1@example',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        fs.writeFileSync.mockReturnValue();

        const createRoleResponse = {
            id: mockRoles.length + 1,
            role: req.body.role
        }

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: createRoleResponse
        })
    });

    it('should return 500 if error when reading file', () => {
        req = {
            body: {
                role: 'newRole'
            },
            id: 1,
            email: 'test1@example',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error when read file');
        });
        fs.writeFileSync.mockReturnValue();

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        })
    });

    it('should return 403 if roles is not allowed', () => {
        req = {
            body: {
                role: 'newRole'
            },
            id: 1,
            email: 'test1@example',
            role: 'user'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        fs.writeFileSync.mockReturnValue();

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 400 if roles is already exist', () => {
        req = {
            body: {
                role: 'admin'
            },
            id: 1,
            email: 'test1@example',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        fs.writeFileSync.mockReturnThis();

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});


describe('updateRoleById', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' }
    ];

    let req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should return 200 and update role', () => {
        req = {
            params: { id: 2 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'role has updated successfully'
        })
    });

    it('should return 403 when roles is not allowed', () => {
        req = {
            params: { id: 2 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    })

    it('should return 404 when role id is not found', () => {
        req = {
            params: { id: 10 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id ${req.params.id} is not found`
        })
    });
});