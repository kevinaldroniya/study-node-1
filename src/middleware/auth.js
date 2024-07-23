const jwt = require('jsonwebtoken');
const { secretKey } = require('./../config/config');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  console.log(token);
  console.log('secretKey: ' + secretKey);

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(403).send({ error: 'Bearer token is required' });
  }

  // console.log({ toke: token })

  const tokenNew = token.split(' ')[1];
  jwt.verify(tokenNew, secretKey, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err)
        // Handle invalid token, e.g., malformed, invalid signature
        return res.status(401).send({ error: 'Invalid token' });
      } else if (err instanceof jwt.TokenExpiredError) {
        // Handle expired token
        return res.status(401).send({ error: 'Token expired' });
      } else {
        // Handle other possible errors
        return res.status(401).send({ error: 'Unauthorized!' });
      }
    }

    req.id = decoded.id;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

