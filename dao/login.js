
const aws = require('aws-sdk');

aws.config.update({
    region: 'us-east-2'
});

const documentClient = new aws.DynamoDB.DocumentClient();

function getUserByUsername(username) {

    const params = {
        TableName: 'users',
        Key: { username: username}
    };

    return documentClient.get(params).promise();
}

function getAllUserName() {

    const params = {
        TableName: 'users',
       
    }

    return documentClient.scan(params).promise();
}

module.exports = {

    getUserByUsername,
    getAllUserName

}