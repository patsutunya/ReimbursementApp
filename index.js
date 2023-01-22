
const { getUserByUsername, getAllUserName } = require('./dao/login');
const { newUserRegistered } = require('./dao/register');
const { getAllReceipts, submitReceipts, getReceiptByID, deleteReceiptByID} = require('./dao/receipt');
const { handlerReceiptByID, updateReceiptByID} = require('./dao/receiptHandler');

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
app.use(bodyParser.json());
const PORT = 3000;


app.get('/username', async (req, res) => {

    try {

        let data = await getAllUserName();
        res.send(data.Items);

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err });
    }

});

app.post('/login', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;


    let data = await getUserByUsername(username);
    const userName = data.Item;

    if (userName) {

        if (userName.password === password) {

            res.send({ 'message': 'Successfully Verified!' });
        } else {

            res.statusCode = 401;
            res.send({ 'message': 'Invalid Password' });
        }

    } else {

        res.statusCode = 409;
        res.send({ 'message': `${username} is not registered, please go to register page` });
    }

});


app.post('/register', async (req, res) => {

    try {

        const username = req.body.username;

        let data = await getUserByUsername(username);
        const newUser = data.Item;

        if (newUser) {

            if (newUser.username === username) {

                res.statusCode = 409;
                res.send({ 'message': 'The user name is taken, please try again' });

            }

        } else {
            await newUserRegistered(req.body.username, req.body.password, req.body.role);
            res.statusCode = 200;
            res.send({ 'message': 'Successfully Registered' });

        }
    } catch (err) {

        res.statusCode = 500;
        res.send(({ 'message': err }));
    };
});

app.get('/receipts', async (req, res) => {

    try {

        let data = await getAllReceipts(req.params.id);
        res.send(data.Items);
    } catch (err) {

        res.statusCode = 500;
        res.send({ 'message': err });
    }

});

app.post('/submit', async (req, res) => {

    try {

        await submitReceipts(uuid.v4(), req.body.description, req.body.amount, req.body.status);
        res.send({ 'message': 'Successfully Submitted' });
    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err });
    }

});

app.get('/receiptItem/:id', async (req, res) => {

    try {

        let data = await getReceiptByID(req.params.id);
        if (data.Item) {
            res.send(data.Item);
        } else {
            res.statusCode = 404;
            res.send({ 'message': `Receipt with id ${req.params.id} is not exist` })
        }
    } catch (err) {

        res.statusCode = 500;
        res.send({ 'message': err });
    }

});

app.delete('/receipt/:id', async (req, res) => {

    try {

        let data = await getReceiptByID(req.params.id);

        if (data.Item) {
            await deleteReceiptByID(req.params.id);
            res.send({ 'message': `Successfully deleted receipt with id ${req.params.id}` });
        } else {

            res.statusCode = 404;
            res.send({ 'message': `Item does not exist to be deleted with id ${req.params.id}` });
        }

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err })
    }


})

app.get('/receiptItem/:id',  async (req, res) => {

    try {

        let data = await handlerReceiptByID(req.params.id)
        if (data.Item){
            res.send(data.Item)
        } else {
            res.statusCode = 404;
            res.send({'message': `Receipt with id ${req.params.id} is not exist`});
        }

    } catch (err){
        res.statusCode = 500;
        res.send({'message': err});
    }
    
});

app.patch('/receiptItem/:id/status', async (req, res) => {

    try {

        let data = await handlerReceiptByID(req.params.id);
        if (data.Item){

          await updateReceiptByID(req.params.id, req.body.status);

                res.statusCode = 200;
                res.send({'message': `Successfully dated status of receipt id ${req.params.id}`})
        

        } else {
            
            res.statusCode = 400;
            res.send({'message': `Item is not exist with id ${req.params.id}`})
        }

        

    } catch (err){
        res.statusCode = 500;
        res.send({'message': err})
    }

})



app.listen(PORT, () => {
    console.log(`Server listen to port ${PORT}`);
});