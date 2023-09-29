import * as express from 'express';
import { collections } from '../database/database';
import * as crypto from 'crypto';
import { StatusMessage } from "../enums";

export const userRouter = express.Router();
userRouter.use(express.json());

// GET check availability of the username
userRouter.get('/checkAvailability/:username', async (req, res) => {
    try {
        const username = req?.params?.username;
        // findOne is used to return one user with the provided username
        const isUsernameTaken = await collections.users.findOne({ username });
        // send false if the name is already taken
        res.status(200).send(!isUsernameTaken);
    } catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
});

// POST to create a new user
userRouter.post('/', async (req, res) => {
    try {
        const user = req.body;
        const isUsernameTaken = await collections.users.findOne({ username: user.username });
        if (isUsernameTaken) {
            res.status(409).send(`Username ${user.username} is already taken`);
            return;
        }


        const result = await collections.users.insertOne(user);

        if (result.acknowledged) {
            res.status(201).send(StatusMessage.UserCreated);
        } else {
            res.status(500).send(StatusMessage.InternalServerError);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await collections.users.findOne({ username });
        if (!user) {
            res.status(404).send(StatusMessage.NotFound);
        } else if (user.password !== password) {
            res.status(401).send('Incorrect password.');
        } else if (user.password === password) {
            const token = crypto.randomUUID().toString(); // TODO: implement JWT
            await collections.users.updateOne({ username }, { $set: { token }})
            res.cookie('token', token, {})
            res.status(200).send({ username: user.username, userId: user._id, token });
        } else {
            res.status(500).send(StatusMessage.InternalServerError)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(StatusMessage.InternalServerError)
    }
})

userRouter.put('/logout', async (req, res) => {
    try {
        const token = req?.headers.authorization;
        if (token) {
            const result = await collections.users.updateOne(
                { token },
                { $unset: { token: '', tokenExpiresAt: '' } }
            );
            if (result) {
                res.status(200).send('Logout successful');
            } else {
                res.status(200).send('Invalid token, user logged out.')
            }
            return;
        }
        res.status(400).send('Bad request');
    } catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }

})

userRouter.get('/isAuthenticated', async (req, res) => {
    try {
        const token = req?.headers.authorization;
        const user = await collections.users.findOne({ token });
        if (user) {
            res.status(200).send(true);
            return;
        }
        res.status(200).send(false);
    }
    catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
})
