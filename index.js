
const { getUserByUsername, getAllUserName } = require('./dao/login');
const { newUserRegistered } = require('./dao/register');
const { getAllReceipts, submitReceipts, getReceiptByID, deleteReceiptByID } = require('./dao/receipt');
const { handlerReceiptByID, updateReceiptByID, handlerReceiptByStatus,
    handlerReceiptByUsername } = require('./dao/receiptHandler');
const jwtUtil = require('./utility/jwtToken');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { text } = require('body-parser');
const app = express();
app.use(bodyParser.json());
const PORT = 3000;


app.get('/username', async (req, res) => {

    try {

        let data = await getAllUserName();
        res.send(data.Items);

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': `${err}` });
    }

});

app.post('/login', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;


    let data = await getUserByUsername(username);
    const userName = data.Item;

    if (userName) {

        if (userName.password === password) {

            res.send({
                'message': 'Successfully Login',
                'token': jwtUtil.createToken(userName.username, userName.role)
            });


        } else {

            res.statusCode = 401;
            res.send({ 'message': 'Invalid Password' });
        }

    } else {

        res.statusCode = 400;
        res.send({ 'message': 'Username is invalid' });
    }

});


app.post('/register', async (req, res) => {

    try {

        const username = req.body.username;

        let data = await getUserByUsername(username);
        const newUser = data.Item;

        if (newUser) {

            if (newUser.username === username) {

                res.statusCode = 400;
                res.send({ 'message': 'This user name is taken' });

            }

        } else {
            await newUserRegistered(req.body.username, req.body.password);
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

        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwtUtil.verifyTokenAndPayLoad(token);

        if (tokenPayload.role === 'associate') {
            await submitReceipts(uuid.v4(), req.body.description, req.body.amount, tokenPayload.username, req.body.role);
            res.send({ 'message': 'Successfully Submitted' });
        }

    } catch (err) {

        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({ 'message': 'Invalid JWT' });
        } else if (err.name === 'TypeError') {
            res.statusCode = 400;
            res.send({ 'message': 'No authorization header provided' })
        } else {
            res.statusCode = 500;
        }
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
            res.send({ 'message': `Successfully deleted receipt` });
        } else {

            res.statusCode = 404;
            res.send({ 'message': `Item does not exist` });
        }

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err })
    }


})

app.get('/receiptItem/:id', async (req, res) => {

    try {

        let data = await handlerReceiptByID(req.params.id)
        if (data.Item) {
            res.send(data.Item)
        } else {
            res.statusCode = 404;
            res.send({ 'message': `Receipt with id ${req.params.id} is not exist` });
        }

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err });
    }

});




app.patch('/receiptItem/:id/status', async (req, res) => {

    try {

        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwtUtil.verifyTokenAndPayLoad(token)

        if (tokenPayload.role === 'manager') {
            let id = req.params.id
            let data = await handlerReceiptByID(id);
            let ticketStatus = data.Item.status

            switch (ticketStatus) {
                case 'approved': 
                    res.send({'message': `This ticket id ${req.params.id} has been approved and it is not allowed being processed twice`});
                    break;
                case 'rejected': 
                    res.send({'message': `This ticket id ${req.params.id} has been rejected and it is not allowed being processed twice`});
                    break;
                case 'pending': 
                    await updateReceiptByID(req.params.id, req.body.status)      
                    res.send({ 'message': `Successfully updated status of receipt id ${req.params.id}`});    
                    break;     

                default:
                    res.statusCode = 200;
            }
        }

    } catch (err) {

        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 401;
            res.send({ 'message': 'Invalid JWT' });

        } else if (err.name === 'TypeError') {

            res.statusCode = 400;
            res.send({ 'message': `This ticket does not exist` });            

        } else {
            res.statusCode = 500;
        }
    }
});


app.get('/receiptItems', async (req, res) => {

    try {

        if (req.query.status) {

            let data = await handlerReceiptByStatus(req.query.status);
            res.send(data.Items);

        } else {
            let data = await handlerReceiptByID();
            res.send(data.Item);
        }

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': `${err}` })
    }

});

app.get('/employeeEndPoint', async (req, res) => {

    try {

        if (req.query.submitter) {

            let data = await handlerReceiptByUsername(req.query.submitter);
            res.send(data.Items);

        } else {
            let data = await handlerReceiptByID(req.query.submitter);
            res.send(data.Item);
        }

    } catch (err) {
        res.statusCode = 500;
        res.send({ 'message': err });
    }

});






app.listen(PORT, () => {
    console.log(`Server listen to port ${PORT}`);
});