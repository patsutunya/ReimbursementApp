
const aws = require('aws-sdk');

aws.config.update({
    region: 'us-east-2'
});

const documentClient = new aws.DynamoDB.DocumentClient();

function handlerReceiptByID (receipt_item_id) {

    const params = {

        TableName: 'receipt_items',
        Key: { receipt_item_id: receipt_item_id }
    }

    return documentClient.get(params).promise();

}

function updateReceiptByID (receipt_item_id, newStatus){

    const params = {
        TableName: 'receipt_items',
        Key: {receipt_item_id},
        UpdateExpression: 'set #n = :value',
        ExpressionAttributeNames: {'#n': 'status'},
        ExpressionAttributeValues: {':value': newStatus}
    }

    return documentClient.update(params).promise();
}

function handlerReceiptByStatus(status){

    const params = {
        TableName: 'receipt_items',
        IndexName: 'status-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {'#c': 'status'},
        ExpressionAttributeValues: {':value': status}
    }

    return documentClient.query(params).promise();
}


function handlerReceiptByUsername (submitter){

    const params = {

        TableName: 'receipt_items',
        IndexName: 'submitter-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {'#c': 'submitter'},
        ExpressionAttributeValues: {':value': submitter}
    }

    return documentClient.query(params).promise();
}




module.exports = {

    handlerReceiptByID,
    updateReceiptByID,
    handlerReceiptByStatus,
    handlerReceiptByUsername,
    
}

