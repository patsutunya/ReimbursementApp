
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');



function createToken(username, role){

    return jwt.sign ({
        "username": username,
        "role": role
    }, 'thisiscreatetoken');
}
  


function verifyTokenAndPayLoad(token){
    jwt.verify = Promise.promisify(jwt.verify);
    return jwt.verify(token, 'thisiscreatetoken');

} 

module.exports = {
    createToken,
    verifyTokenAndPayLoad
}