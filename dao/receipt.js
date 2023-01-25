
const aws = require('aws-sdk');
const Promise = require('bluebird');


aws.config.update({
    region: 'us-east-2'
});

const documentClient = new aws.DynamoDB.DocumentClient();



function getAllReceipts(receipt_item_id ){

    const params = {
        TableName: 'receipt_items',
        Key: {receipt_item_id}
    }

    return documentClient.scan(params).promise();
}

function submitReceipts(receipt_item_id, description, amount, username){

    const params = {

        TableName: 'receipt_items',
        Item: {

            receipt_item_id: receipt_item_id,
            description: description,
            amount: amount,
            submitter: username,
            role: "associate",
            status: "pending"

        }
    }

    
    return documentClient.put(params).promise();
}

function getReceiptByID(receipt_item_id){

    const params = {
        TableName: 'receipt_items',
        Key: {receipt_item_id}
    }

    return documentClient.get(params).promise();
}

function deleteReceiptByID(receipt_item_id){

    const params = {
        TableName: 'receipt_items',
        Key: {receipt_item_id}
    }

    return documentClient.delete(params).promise();
}



module.exports = {
                    getAllReceipts, submitReceipts, deleteReceiptByID,
                    getReceiptByID
                }