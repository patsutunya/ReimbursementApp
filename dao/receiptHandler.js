
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

    return documentClient.scan(params).promise();

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


function handlerReceiptByUsername (username){

    const params = {

        TableName: 'receipt_items',
        IndexName: 'username-index',
        KeyConditionExpression: '#c = :value',
        ExpressionAttributeNames: {'#c': 'username'},
        ExpressionAttributeValues: {':value': username}
    }

    return documentClient.query(params).promise();
}

function handlerOverrideReceipt (receipt_item_id, status){

    const params = {
        TableName: 'receipt_items',
        Item: {
            receipt_item_id: receipt_item_id,
            status: status
            
        }

    }
      return documentClient.scan(params).promise();
}

module.exports = {

    handlerReceiptByID,
    updateReceiptByID,
    handlerReceiptByStatus,
    handlerOverrideReceipt,
    handlerReceiptByUsername,
    
}

