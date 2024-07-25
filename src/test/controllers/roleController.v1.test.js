const fs = require('fs');
const roleController = require('./../../controllers/roleController.v1');
const userController = require('./../../controllers/userController.v2')
const roleService = require('./../../services/roleService');
const userService = require('./../../services/userService');

jest.mock('fs');
jest.mock('./../../services/roleService');

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

    it('should return 200 and show all roles', async () => {
        req = {
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        roleService.getAllRoles.mockReturnValue(mockRoles);

        await roleController.getAllRoles(req, res);
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
        roleService.getAllRoles.mockImplementation(() => {
            throw new Error('Error reading file')
        });

        roleController.getAllRoles(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        });
    })

    it('should return 403 if user role is not admin or superadmin', async () => {
        req = {
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        }

        roleService.getAllRoles.mockReturnValue(mockRoles)
        await roleController.getAllRoles(req, res);
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

        const role = mockRoles.find(role => role.id = req.params.id);

        roleService.getRoleById.mockReturnValue(role);

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

        roleService.getRoleById.mockImplementation(() => {
            throw new Error('500')
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

        roleService.getRoleById.mockReturnValue(mockRoles.indexOf(1));
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
        // roleService.getAllUsers.mockReturnValue(mockRoles)
        roleService.getRoleById.mockImplementation(() => {
            throw new Error('404');
        });
        roleController.getRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id: ${req.params.id}, is not found`
        })
    })
});

describe('createRole', () => {

    let mockRoles;
    let req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    const getAllUsers = jest.spyOn(roleService, 'getAllRoles');

    beforeEach(() => {
        jest.clearAllMocks();
        mockRoles = [
            { id: 1, role: 'superadmin' },
            { id: 2, role: 'admin' }
        ];
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

        getAllUsers.mockReturnValue(mockRoles);

        // console.log({ mockRoles })
        const newRole = {
            id: mockRoles.length + 1,
            role: req.body.role
        }

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        //     data: createRoleResponse
        // })

        expect(roleService.saveRole).toHaveBeenCalledWith(mockRoles);
        expect(mockRoles.length).toBe(3);
        // console.log(mockRoles[mockRoles.length - 1].role)
        expect(mockRoles[mockRoles.length - 1].role).toBe(newRole.role)
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

        getAllUsers.mockImplementation(() => {
            throw new Error('500')
        });

        roleController.createRole(req, res);
        // console.log({ mockRoles })
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        })
        expect(mockRoles.length).toBe(2);
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

        getAllUsers.mockReturnValue(mockRoles)

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

        getAllUsers.mockReturnValue(mockRoles)

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
                id: 5
            },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        getAllUsers.mockReturnValue(mockRoles);

        roleController.createRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
    });
});


describe('updateRoleById', () => {
    let mockRoles;

    let req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };

    const getAllRoles = jest.spyOn(roleService, 'getAllRoles')

    beforeEach(() => {
        jest.clearAllMocks();
        mockRoles = [
            { id: 1, role: 'superadmin' },
            { id: 2, role: 'admin' }
        ];
    });

    it('should return 200 and update role', () => {
        req = {
            params: { id: 2 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        getAllRoles.mockReturnValue(mockRoles);

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

        getAllRoles.mockReturnValue(mockRoles)
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

        getAllRoles.mockReturnValue(mockRoles);
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id ${req.params.id} is not found`
        });
    });

    it('should return 400 if request is invalid', () => {
        req = {
            params: { id: 2 },
            body: { id: 1, role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        getAllRoles.mockReturnValue(mockRoles);
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
    });

    it('should return 500 when error reading file', () => {
        req = {
            params: { id: 1 },
            body: { role: 'adminUpdate' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        getAllRoles.mockImplementation(() => {
            throw new Error('500');
        })
        roleController.updateRole(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    })
});

describe('deleteRoleById', () => {
    const mockRoles = [
        { id: 1, role: 'superadmin' },
        { id: 2, role: 'admin' },
        { id: 3, role: 'user' }
    ];

    let req = {};

    const getAllRoles = jest.spyOn(roleService, 'getAllRoles');

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('should return 200 and delete role', () => {
        req = {
            params: { id: 3 },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        getAllRoles.mockReturnValue(mockRoles)
        roleController.deleteRoleById(req, res);
        // console.log({ mockRoles })
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockRoles.length).toBe(2);

    });

    it('should return 403 if user role is not allowed', () => {
        req = {
            params: { id: 1 },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        };

        getAllRoles.mockReturnValue(mockRoles)
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

        getAllRoles.mockImplementation(() => {
            throw new Error('500')
        })

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

        getAllRoles.mockReturnValue(mockRoles);
        roleController.deleteRoleById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: `role with given id: ${req.params.id}, is not found`
        });
    });
});


describe('getUserRole', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', role: 'superadmin' },
        { id: 2, name: 'test2', email: 'test2@example.com', role: 'admin' },
        { id: 3, name: 'test3', email: 'test3@example.com', role: 'user' }
    ];

    let req = {};

    const getAllRoles = jest.spyOn(roleService, 'getAllRoles');
    const getAllUsers = jest.spyOn(userService, 'getAllUsers');


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

        getAllUsers.mockReturnValue(mockUsers);
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

        getAllUsers.mockReturnValue(mockUsers);

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

        getAllUsers.mockImplementation(() => {
            throw new Error('500')
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

        getAllUsers.mockReturnValue(mockUsers)

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

        getAllUsers.mockReturnValue(mockUsers)
        roleController.getUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Bad Request'
        })
    });
});

describe('assignRoleToUser', () => {
    let mockUsers, mockRoles, req;
    const getAllUsers = jest.spyOn(userService, 'getAllUsers');
    const getAllRoles = jest.spyOn(roleService, 'getAllRoles');

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }

    beforeEach(() => {
        jest.clearAllMocks();

        mockUsers = [
            { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'superadmin' },
            { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'admin' },
            { id: 3, name: 'test3', email: 'test3@example.com', password: 'test', role: 'user' },
            { id: 4, name: 'test4', email: 'test4@example.com', password: 'test', role: 'user' },

        ];

        mockRoles = [
            { id: 1, role: 'superadmin' },
            { id: 2, role: 'admin' },
            { id: 3, role: 'users' },
            { id: 4, role: 'doctor' },
            { id: 5, role: 'pharmacy' }
        ];
    })

    it('should assign new role to user selected', async () => {
        req = {
            params: { userId: 3 },
            body: { role: 'doctor' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        getAllUsers.mockReturnValue(mockUsers);
        getAllRoles.mockReturnValue(mockRoles);

        await roleController.assignRoletoUser(req, res);
        // console.log({ mockUsers })
        expect(res.status).toHaveBeenCalledWith(200);
    })

    it('should return 403 is user role is not allowed', async () => {
        req = {
            params: { userId: 3 },
            body: { role: 'doctor' },
            id: 1,
            email: 'test1@example.com',
            role: 'user'
        };

        getAllUsers.mockReturnValue(mockUsers);
        getAllRoles.mockReturnValue(mockRoles);

        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 500 if error when reading file', async () => {
        req = {
            params: { userId: 3 },
            body: { role: 'doctor' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        }

        getAllRoles.mockImplementation(() => {
            throw new Error('500')
        });
        getAllUsers.mockReturnValue(mockUsers);

        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500)
    });

    it('should return 400 when request is invalid', async () => {
        req = {
            params: { userId: 3 },
            body: { id: 4, role: 'doctor' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        getAllRoles.mockReturnValue(mockRoles);
        getAllUsers.mockReturnValue(mockUsers);

        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400)
    });

    it('should return 404 if user or role is not found', async () => {
        req = {
            params: { userId: 10 },
            body: { role: 'doctor' },
            id: 1,
            email: 'test1@example.com',
            role: 'superadmin'
        };

        getAllRoles.mockReturnValue(mockRoles);
        getAllUsers.mockReturnValue(mockUsers);

        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404)
    });

    it('should return 403 when user doesnt have permission to perform those action', async () => {
        req = {
            params: { userId: 3 },
            body: { role: 'superadmin' },
            id: 2,
            email: 'test2@example.com',
            role: 'admin'
        }

        getAllRoles.mockReturnValue(mockRoles);
        getAllUsers.mockReturnValue(mockUsers);

        await roleController.assignRoletoUser(req, res);
        expect(res.status).toHaveBeenCalledWith(403)
    });
});