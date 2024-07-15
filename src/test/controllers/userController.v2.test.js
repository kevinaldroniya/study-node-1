const fs = require('fs');
const userControllerV2 = require('../../controllers/userController.v2');

jest.mock('fs');

describe('getAllUsers', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'user' }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all users', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userControllerV2.getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.message).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle file read errors', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockImplementation(() => {
            throw new Error('Error reading file');
        });

        userControllerV2.getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
})

describe('getUserById', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'user' }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a user by id', () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userControllerV2.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
    })
});

describe('registerUser', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'user' }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register new user', () => {
        const req = {
            body: {
                name: 'test3',
                email: 'test3@example.com',
                password: 'test'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockReturnValue();

        userControllerV2.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ email: req.body.email, name: req.body.name });
    })

    it('should return 409 if user already exists', () => {
        const req = {
            body: {
                name: 'test2',
                email: 'test2@example.com',
                password: 'test'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userControllerV2.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    })

    it('should handle file read errors', () => {
        const req = {
            body: {
                name: 'test3',
                email: 'test3@example.com',
                password: 'test'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error reading file');
        });

        userControllerV2.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it('should retun 400 if request is invalid', () => {
        const req = {
            body: {
                id: 3,
                name: 'test3',
                email: 'test3@example.com',
                password: 'test',
                role: 'user'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        userControllerV2.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request' });
    });
})


describe('updateUser', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'user' }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update user and return 200', () => {
        const req = {
            params: { id: 2 },
            body: {
                name: 'testupdated2',
                email: 'test2@example.com',
                password: 'test'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userControllerV2.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
    });

    it('should handle file read errors', () => {
        const req = {
            params: { id: 2 },
            body: {
                name: 'testupdated2',
                email: 'test2@example.com',
                password: 'test'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('error reading file')
        });

        userControllerV2.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it.only('should return 400 and invalid request', () => {
        const req = {
            params: { id: 2 },
            body: {
                name: 'test2update',
                email: 'test2@example.com',
                password: 'test',
                id: 2
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers))

        userControllerV2.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid request' })
    });
});