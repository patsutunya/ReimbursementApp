
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

// const token = jwt.sign({
//     username: 'admin1',
//     role: 'admin'
// }, 'thisscret', {expiresIn: '3d'});

// console.log(token);





    const token = jwt.sign({
        username: 'user3',
        role: 'associate'
    }, 'thissecret', {expiresIn: '14d'})

   console.log(token);

jwt.verify = Promise.promisify(jwt.verify);

jwt.verify(token, 'thissecret').then((data)=>{
    
    console.log(data);
})

// function verifyTokenAndPayLoad(token){
//     return jwt.verify(token, 'thissecret');

// }

// module.exports = {
//     createJWt,
//     verifyTokenAndPayLoad
// }