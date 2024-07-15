const jwt = require('jsonwebtoken');
const { secretKey } = require('./../config/config');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if(!token || !token.startsWith('Bearer ')){
    return res.status(403).send({error:'Bearer token is required'});
  }


  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Unauthorized!' });
    }
    req.id = decoded.id;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  });
};

