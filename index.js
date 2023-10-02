const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yaml');
var mysql = require('mysql');

const port = process.env.PORT || 3000;
// Import bcrypt for password encryption
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const YAML = require("yamljs");
const saltRounds = 10;


// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Connect to database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "logins"
});

require('dotenv').config();
// Create a user
app.post('/signIn', (req, res) => {
    // Get email and password from request body
    const email = req.body.email;
    const password = req.body.password;
    // Check if user with that email exists
    con.query(`select *
               from logininfo
               where email = '${email}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            // Compare the password
            bcrypt.compare(password, result[0].password, function (err, result) {
                if (result) {
                    res.status(200).send('User logged in');
                } else {
                    res.status(401).send('Incorrect password');
                }
            });
        } else {
            res.status(404).send('User not found');
        }
    })

})
app.post('/MakeId', (req, res) => {
    // Get email and password from request body
    const email = req.body.email;
    const password = req.body.password;
    // Check if user with that email exists
    con.query(`select sessionId
               from logininfo
               where email = '${email}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            // Return the session id
            res.status(200).send(result[0]);
        } else {
            res.status(404).send('User not found');
        }
    })

})
app.post('/GetId', (req, res) => {
        // Get session id from request body
        const sessionId = req.body.sessionId;
        // Get email with that session id from database
        con.query(`select email
                   from logininfo
                   where sessionId = '${sessionId}'`, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                // Return the email
                res.status(200).send(result[0]);
            } else {
                res.status(404).send('Session not found');
            }
        })
    }
)
app.post('/userReg', (req, res) => {

    // Get email and password from request body
    const email = req.body.email;
    const password = req.body.password;

    // Check if user already exists
    con.query(`select *
               from logininfo
               where email = '${email}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            res.status(400).send('User already exists');
        } else {
            bcrypt.hash(email, saltRounds, function (err, sessionId) {
                // Hash the password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    con.query(`insert into logininfo (email, password, sessionId)
                               values ('${email}', '${hash}', '${sessionId}')`, function (err, result, fields) {
                        if (err) throw err;
                        res.status(201).send('User created');
                    });
                });
            })
        }
    })
});
app.put('/passChange', (req, res) => {
    const email = req.body.email;
    const curPass = req.body.curPass;
    const newPass1 = req.body.newPass1;
    const newPass2 = req.body.newPass2;
    console.log(email, curPass, newPass1, newPass2)
    con.query(`select *
               from logininfo
               where password = '${curPass}' and  email = '${email}'`, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            res.status(401).send('Incorrect current password. Please try again.');
        } else {
            if (newPass1 === newPass2) {
                bcrypt.hash(newPass1, saltRounds, function (err, hash) {
                    // Store hash in your password DB.
                    con.query(`update logininfo
                               set password = '${hash}'
                               where email = '${email}'`, function (err, result, fields) {
                        if (err) throw err;
                        res.status(201).send('Password changed');
                    });
                })
            } else {
                res.status(400).send('New passwords do not match');
            }
        }
    })
});
// Profile page reroute
app.get('/account', (req, res) => {
    res.sendFile(__dirname + '/public/account.html');
})
app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}`);
})