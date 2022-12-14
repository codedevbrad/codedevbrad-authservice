/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const jwt = require('jsonwebtoken');

const JWT_class = require('../jwt');

const generateAccessToken = ( user ) => new Promise( async ( resolve , reject ) => {
    let JWT_tokenSecret = JWT_class.tellJwtSecret();
    let token = jwt.sign( user , JWT_tokenSecret , { expiresIn: '60d' });
    resolve( token );
});

function authenticateTokenMiddleware (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.status(401).send('user not allowed access');
  
    jwt.verify(token, process.env.authserviceSECRET , ( err , user ) => {

      if (err) return res.status(403).send('token no longer authenticated');

      req.token = user;
      next( );
    });
}

const authenticateToken = ( req ) => new Promise( async ( resolve , reject ) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) reject('user not allowed access');
  
    jwt.verify(token, process.env.authserviceSECRET , ( err , user ) => {

      if (err) return reject('token no longer authenticated');

      resolve( user );
    });
});

module.exports = {
    generateAccessToken , authenticateTokenMiddleware , authenticateToken
};