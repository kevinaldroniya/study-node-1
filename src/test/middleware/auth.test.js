const jwt = require('jsonwebtoken');
const auth = require('./../../middleware/auth');
const { secretKey } = require('./../../config/config')

jest.mock('jsonwebtoken');

describe('verify token middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
          headers: {},
        };
        res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
        next = jest.fn();
      });

    it('should call next if token is valid', () => {
        req.headers['authorization'] = `Bearer ${jwt.sign({ id: 1, email:'test1@example.com', role: 'admin' }, secretKey)}`;
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {id: 1,email:'test1@example.com', role:'admin'})
        });

        auth.verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.id).toBe(1);
        expect(req.email).toBe('test1@example.com');
        expect(req.role).toBe('admin');
    });

    it.only('should return 403 if token is not start with Bearer', () => {
        req.headers['authorization'] = 'Basic validtoken';
        
        auth.verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({error:'Bearer token is required'})
    });

    it('should return 401 if token is invalid', () => {
        req.headers['authorization'] = `Bearer ${jwt.sign({ id: 1, role: 'admin' }, secretKey)}`;
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null)
        });

        auth.verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({error:'Unauthorized!'});
    })
});