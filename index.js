const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yaml');
var mysql = require('mysql');



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "logins"
});



require('dotenv').config();

const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Use the Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse JSON
app.use(express.json());

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).send(err.message);
})

// End point for user registration
app.post('/users', (req, res) => {
    //
    res.status(201).send('User registered');

    let email = req.body.inputEmail
    let password = req.body.inputPassword
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql=`insert into logininfo('email','password') values (${email},${password})`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    })
})

app.listen(port, () => {
    console.log(`App running. Docs at http://localhost:${port}/docs`);
})
