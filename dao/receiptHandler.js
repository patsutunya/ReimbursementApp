
const aws = require('aws-sdk');

aws.config.update({
    region: 'us-east-2'
});

const documentClient = new aws.DynamoDB.DocumentClient();

function handlerReceiptByID (receipt_item_id) {

    const params = {

        TableName: 'receipt_items',
        Key: { 
                receipt_item_id: receipt_item_id, 
                 }
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


module.exports = {

    handlerReceiptByID,
    updateReceiptByID
}