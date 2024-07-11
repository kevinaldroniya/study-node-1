const fs = require('fs');
const userController = require('./../controllers/userController.js');
const { isTypedArray } = require('util/types');

//mock fs module
jest.mock('fs');

describe('getAllUsers', () => {

    const mockUsers = [
        {
            id: 1,
            name: 'test1',
            email: 'test1@example.com',
            password: 'test',
            role: 'admin'
        },
        {
            id: 2,
            name: 'test2',
            email: 'test2@example.com',
            password: 'test',
            role: 'user'
        }
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all users', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userController.getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle file read errors', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockImplementation(() => {
            throw new Error('Error reading file');
        });

        userController.getAllUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    })
});


describe('getUserById', () => {
    const mockUsers = [
        {
            id: 1,
            name: 'test1',
            email: 'test1@example.com',
            password: 'test',
            role: 'admin'
        },
        {
            id: 2,
            name: 'test2',
            email: 'test2@example.com',
            password: 'test',
            role: 'user'
        }
    ];

    it('should return a user by id', () => {
        const req = {
            params: { id: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        userController.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should return 404 if user is not found', () => {
        const req = {
            params: { id: 3 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        userController.getUserById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
});


describe('createUser', () => {
    const mockUsers = [
        {
            id: 1,
            name: 'test1',
            email: 'test1@example.com',
            password: 'test',
            role: 'admin'
        },
        {
            id: 2,
            name: 'test2',
            email: 'test2@example.com',
            password: 'test',
            role: 'user'
        }
    ];

    it('should create a new user', () => {
        const req = {
            body: {
                id: 3,
                name: 'test3',
                email: 'test3@example.com',
                password: 'test',
                role: 'user'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        const expectedUsersAfterAddition = [...mockUsers, req.body]; // Assuming IDs are unique and no other modifications are made to the user object


        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockReturnValue();
        const user = userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            expect.any(String), // The exact file path might vary, so we use expect.any(String)
            JSON.stringify(expectedUsersAfterAddition, null, 2),
            'utf-8'
        );

    });

    it('should handle file write errors', () => {
        const req = {
            body: {
                id: 3,
                name: 'test3',
                email: 'test3@example.com',
                password: 'test',
                role: 'user'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockImplementation(() => {
            throw new Error('Error writing file');
        });
        userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});


describe('updateUser', () => {
    const mockUsers = [
        { id: 1, name: 'San Doe', email: 'san@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'Nam Doe', email: 'nam@example.com', password: 'test', role: 'user' }
    ];

    it('should update a user successfully', () => {
        const req = {
            params: { id: '1' },
            body: { name: 'Updated Name' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockImplementation((path, data) => {
            const userAfterUpdate = JSON.parse(data);
            console.log('userAfterUpdate: \n', userAfterUpdate);
        });

        userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
    });

    it('should return 404 if user not found', () => {
        const req = {
            params: { id: '3' }, // ID not present in mockUsers
            body: { name: 'New Name' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle file write errors', () => {
        const req = {
            params: { id: '1' },
            body: { name: 'Another Name' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockImplementation(() => {
            throw new Error('Error writing file');
        });

        userController.updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('deleteUser', () => {
    const mockUsers = [
        { id: 1, name: 'test', email: 'test@example.com', password: 'test', role: 'admin' },
        { id: 2, name: 'test2', email: 'test2@example.com', password: 'test', role: 'user' }
    ];

    it('should delete a user successfully', () => {
        const req = {
            params: { id: '2' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        fs.writeFileSync.mockImplementation((path, data) => {
            const userLeft = JSON.parse(data);
            // console.log('userLeft: \n', userLeft);
        });

        userController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });

    });
});