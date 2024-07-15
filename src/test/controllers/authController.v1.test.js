const fs = require('fs');
const authController = require('./../../controllers/authController.v1');

jest.mock('fs');

describe('signin', () => {
    const mockUsers = [
        { id: 1, name: 'test1', email: 'test1@example.com', password: 'test', role: 'admin' }
    ]

    it('should return 200 and user info (id, email, name, token)', () => {
        const req = {
            body: {
                email: 'test1@example.com',
                password: 'test'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
        const user = mockUsers.find(user => user.email === req.body.email);
        // console.log('user on ut:' + JSON.stringify(user));

        const userLoginResponse = {
            id: user.id,
            email: user.email,
            token: 'newToken'
        }
        console.log(userLoginResponse);

        authController.signin(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: userLoginResponse
        });
    });

    it('should return 500 and file read error', () => {
        const req = {
            email: 'test1@example.com',
            password: 'test'
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        fs.readFileSync.mockReturnValue(() => {
            throw new Error('Error read file');
        });

        authController.signin(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error when reading file' });
    });

    it('should return 401 and Unauthorized', () => {
        const req = {
            body: {
                email: 'test2@example.com',
                password: 'test'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));

        authController.signin(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: 'Unauthorized'
        });
    });
});