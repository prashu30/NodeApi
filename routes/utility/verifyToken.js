const jwt = require('jsonwebtoken');
const secretKey = require('../../model/keys').secretKey;
const decode = require('jwt-decode');

module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.json('Access Denied');
    try {
      const verified = jwt.verify(token, secretKey);
      req.user = verified.user;
      next();
    } catch (error) {
      // let message;
      // if(!req.user) message = 'user not found';
      // else message = error;        
      // res.json(message);
      res.json(error)
    } 
};