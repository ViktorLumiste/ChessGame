import express, {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {User} from '@prisma/client';
import {handleErrors} from './handleErrors';

const prisma = new PrismaClient();
const router = express.Router();
// halp meh
router.get('/', handleErrors(async (req: Request, res: Response) => {
    const examples: User[] = await prisma.user.findMany();
    res.json(examples);
}));

export default router;