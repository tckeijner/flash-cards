import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const userRouter = express.Router();
userRouter.use(express.json());

// GET for all users
userRouter.get('/', async (_req, res) => {
    try {
        const users = await collections.users.find({}).toArray();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET to get one user by ID
userRouter.get('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        // findOne is used to return one user with the proved ID
        const user = await collections.users.findOne(query);

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`No user found with id ${id}`);
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// GET check availability of the username
userRouter.get('/checkAvailability/:username', async (req, res) => {
    try {
        const username = req?.params?.username;
        // findOne is used to return one user with the provided username
        const isUsernameTaken = await collections.users.findOne({ username });
        // send false if the name is already taken
        res.status(200).send(!isUsernameTaken);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// POST to create a new user
userRouter.post('/', async (req, res) => {
    try {
        const user = req.body;
        const isUsernameTaken = await collections.users.findOne({ username: user.username })
        if (isUsernameTaken) {
            res.status(409).send(`Username ${user.username} is already taken`);
            return;
        }


        const result = await collections.users.insertOne(user);

        if (result.acknowledged) {
            res.status(201).send(`Created new user with ID ${result.insertedId}`);
        } else {
            res.status(500).send('User creation failed');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});
