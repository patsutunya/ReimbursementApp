
const aws = require('aws-sdk');

aws.config.update({
    region: 'us-east-2'
});


const documentClient = new aws.DynamoDB.DocumentClient();


function newUserRegistered (username, password) {

   const params = {

    TableName: 'users',
    Item: {
        username: username,
        password: password,
        role: "associate"
       
    }
     
   }
    return documentClient.put(params).promise();
}

module.exports = {newUserRegistered}
