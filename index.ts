import express, {Express, NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {Error} from './/types';
import * as dotenv from 'dotenv';
import exampleRoutes from ".//routes/exampleRoutes";
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import {User} from '@prisma/client';

dotenv.config();
const port: Number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

// Import bcrypt for password encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(err.statusCode || 500).send(err.message || 'Internal Server Error');
});


// Endpoint to create a new User with email and password
app.post('/users', async (req, res) => {
    const {email, password} = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { email: {email} }
        });
        if (userExists) {
            return res.status(400).send('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.User.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        res.status(201).send('User created');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


// Routes
app.use('/examples', exampleRoutes);

// Health check
app.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

// Start the server
app.listen(port, () => console.log(`Running at http://localhost:${port} and docs at http://localhost:${port}/docs`));