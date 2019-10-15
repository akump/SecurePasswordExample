const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;
const mongoUrl = "mongodb+srv://admin2:potato1234@cluster0-3tdkm.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "passwordDB";
var database, collection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')))

app.get('/login', (req, res) => {
    const username = req.body.username
    const providedPassword = req.body.password;
    collection.findOne({
        username: username
    }).then(user => {
        bcrypt.compare(providedPassword, user.password).then(function (comparison) {
            if (comparison) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        });
    })
});

app.post('/createUser', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        let user = {
            username: req.body.username,
            password: hash
        };
        collection.insertOne(user).then((response, error) => {
            if (error) {
                return response.status(500).send(error);
            }
            res.sendStatus(200);
        });
    });
});

app.listen(port, () =>
    mongo.connect(mongoUrl, {
        useNewUrlParser: true
    }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(dbName);
        collection = database.collection("passwordDB");
        console.log("Connected to `" + dbName + "`!");
        console.log(`Example app listening on port ${port}!`);
    })
);