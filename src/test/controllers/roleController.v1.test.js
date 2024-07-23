const fs = require('fs');
const roleController = require('./../../controllers/roleController.v1');
const userController = require('./../../controllers/userController.v2')
const path = require('path');

jest.mock('fs');
jest.mock('./../../controllers/userController.v2.js');

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

    it('should return 404 when role with given id is not found', () => {
        req = {
            params: { id: 5 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.getRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id: ${req.params.id}, is not found`
        })
    })
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

    it('should return 409 if roles is already exist', () => {
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
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: `${req.body.role} is already exists`
        })
    });

    it('should return 400 when request is invalid', () => {
        req = {
            body: {
                role: 'admin',
                id: 1
            },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        fs.writeFileSync.mockReturnValue()
        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
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
        });
    });

    it('should return 400 if request is invalid', () => {
        req = {
            params: { id: 2 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
    });
});

describe('deleteRoleById', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' },
        { id: 3, role: 'user' }
    ];

    let req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should return 200 and delete role', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));

        roleController.deleteRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);

    });

    it('should return 403 if user role is not allowed', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        };

        fs.readFileSync.mockReturnThis(JSON.stringify(mockRoles));

        roleController.deleteRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Forbidden'
        })
    });

    it('should return 500 when error reading file', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('File read error')
        });

        roleController.deleteRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        })
    });

    it('should return 404 when role is not found', () => {
        req = {
            params: { id: 4 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));

        roleController.deleteRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id: ${req.params.id}, is not found`
        })
    });
});


describe('getUserRole', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', role: 'superadmin' },
        { id: 2, name: 'test2', email: 'test2@example.com', role: 'admin' },
        { id: 3, name: 'test3', email: 'test3@example.com', role: 'user' }
    ];

    let req = {};

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should return 200 and user role data', async () => {
        req = {
            params: {
                userId: 2,
            },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }
        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        const userRole = mockUsers.find(user => user.id === req.params.userId);
        const userRoleResponse = userRole.role;

        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            role: userRoleResponse
        })
    });

    it('should return 403 if user role is not allowed', () => {
        req = {
            params: {
                userId: 2,
            },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 500 if file read error', () => {
        req = {
            params: {
                userId: 2,
            },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error reading file');
        });

        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        })
    });

    it('should return 404 when userId is not found', () => {
        req = {
            params: { userId: 5 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `user with given id: ${req.params.userId}, is not found`
        })
    });

    it('should return 400 when request is invalid', () => {
        req = {
            params: { userId: 'a' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
    });
});

describe('assignRoleToUser', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' },
        { id: 3, role: 'user' }
    ];

    const mockUsers = [
        { id: 3, name: 'test3', email: 'test3@example.com', role: 'user' }
    ]

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it.only('should return 200 and update user role', async () => {
        req = {
            params: { userId: 3 },
            body: { role: 'patient' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }


        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles))
        userController.getUserById.mockResolvedValue({
            status: 200,
            json: { id: 1, name: 'Test User' }
        });
        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    })
});