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


// Connect to databas
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "logins"
});

require('dotenv').config();
// Create a user

app.post('/users', (req, res) => {

    // Get email and password from request body
    const email = req.body.email;
    const password = req.body.password;
        // Check if user already exists
        con.query(`select * from logininfo where email='${email}'`, function (err, result, fields) {
            if (err) throw err;
            if(result.length>0){
                res.status(400).send('User already exists');
            }else{
                // Hash the password
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    // Store hash in your password DB.
                    con.query(`insert into logininfo (email,password)values('${email}','${hash}')`, function (err, result, fields) {
                        if (err) throw err;
                        res.status(201).send('User created');
                    });
                });
            }
        })

})

app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}`);
})