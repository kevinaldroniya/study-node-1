const request = require('supertest');
const express = require('express');
const userController = require('./../../controllers/userController');
jest.mock('./../../controllers/userController'); // Mock the userController

const app = express();
app.use(express.json());

const router = require('./../../routes/userRoute'); // Adjust the path as necessary
app.use('/users', router);

beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
});

describe('User Routes with Mocks', () => {
    it('GET / should return all users', async () => {
        userController.getAllUsers.mockImplementation((req, res) => res.status(200).json([{ id: 1, name: 'Test User' }]));
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Test User' }]);
        expect(userController.getAllUsers).toHaveBeenCalled();
    });

    it('POST / should create a new user', async () => {
        userController.createUser.mockImplementation((req, res) => res.status(201).json({ id: 1, ...req.body }));
        const newUser = { name: 'New User', email: 'new@example.com' };
        const response = await request(app).post('/users').send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ id: 1, ...newUser });
        expect(userController.createUser).toHaveBeenCalled();
        // expect(userController.createUser).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    it('GET /:id should return a user by id', async () => {
        const userId = 1;
        userController.getUserById.mockImplementation((req, res) => res.status(200).json({ id: userId, name: 'Test User' }));
        const response = await request(app).get(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: userId, name: 'Test User' });
        expect(userController.getUserById).toHaveBeenCalled();
    });

    it('PUT /:id should update a user', async () => {
        const userId = 1;
        userController.updateUser.mockImplementation((req, res) => res.status(200).json({ message: 'User updated successfully' }));
        const response = await request(app).put(`/users/${userId}`).send({ name: 'Updated User' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'User updated successfully' });
        expect(userController.updateUser).toHaveBeenCalled();
    });

    it('DELETE /:id should delete a user', async () => {
        const userId = 1;
        userController.deleteUser.mockImplementation((req, res) => res.status(200).json({ message: 'User deleted successfully' }));
        const response = await request(app).delete(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted successfully' });
        expect(userController.deleteUser).toHaveBeenCalled();
    });
});