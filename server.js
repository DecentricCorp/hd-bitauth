const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 8080;

// Fakes
var nonce = "nonce123"
var token = "token123"

// App
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static('./'))

// -> Replace dataStore with real database
var dataStore =
    [
        { email: "shannon@cov.al", nonce: nonce, address: "1HomsdJVrTJqiLsRZrmdU1WnnFYj3kntfN" }
    ]
var bitauth = require("./hd-bitauth.js")

// -> Pass this to loyyal server and let wizard communicate with localhost
app.post('/nonce', function (req, res) {
    res.send(nonce)
})

// -> Pass this to loyyal server and let wizard communicate with localhost
app.post('/auth', function (req, res) {
    var account = dataStore.filter(function(account){return account.email === req.body.email})[0]
    if (!account) {
        res.status(500).send('unregistered')
    } else {
        if (account.address !== req.body.address.toString()) {
            res.status(401).send('invalid credentials (address)')
        } else {
            var authenticated = bitauth.bitcoin.message.verify(req.body.address.toString(), JSON.parse(req.body.signature), nonce, bitauth.bitcoin.networks.bitcoin)
            if (authenticated) {                
                res.send(token)
            } else {
                res.status(401).send('invalid credentials (signature)')
            }
        }
    }
})

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);