
const dotenv = require('dotenv');
dotenv.config();

exports.secretKey = process.env.TOKEN_SECRET;

console.log('secretKey: ' + this.secretKey);