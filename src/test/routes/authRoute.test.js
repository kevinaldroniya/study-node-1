const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('../../routes/authRoute');
const authController = require('../../controllers/authController.v1');
jest.mock('../../controllers/authController.v1');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoute);

describe('POST /auth/signin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    

    it('should return 200 and token on successful login', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            token: 'jwttoken'
        };
        authController.signin.mockImplementation((req, res) => res.status(200).json({
            success: true,
            data: mockUser
        }));

        const response = await request(app).post('/auth/signin').send({
            email: 'test@example.com',
            password: 'password'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: mockUser
        });
        expect(authController.signin).toHaveBeenCalled();
    });

    it('should return 401 for unauthorized access', async () => {
        authController.signin.mockImplementation((req, res) => res.status(401).json({
            success: false,
            error: 'Unauthorized'
        }));

        const response = await request(app).post('/auth/signin').send({
            email: 'wrong@example.com',
            password: 'wrongpassword'
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            success: false,
            error: 'Unauthorized'
        });
        expect(authController.signin).toHaveBeenCalled();
    });
});