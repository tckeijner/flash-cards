import * as express from 'express';
import { collections } from '../database/database';
import * as jwt from 'jsonwebtoken';
import { StatusMessage } from "../enums";
import { getUserFromDecodedToken, verifyJwt } from "../handlers";
import * as process from "process";

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

// POST to log the user in
userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await collections.users.findOne({ username });
        if (!user) {
            res.status(404).send(StatusMessage.NotFound);
        } else if (user.password !== password) {
            res.status(401).send('Incorrect password.');
        } else if (user.password === password) {
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET_KEY);
            res.cookie('token', token, {})
            res.status(200).send({ username: user.username, userId: user._id, token });
        } else {
            res.status(500).send(StatusMessage.InternalServerError);
        }
    } catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
})

// GET check if user is already authenticated
userRouter.get('/isAuthenticated', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { user } = req.body;
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

// PUT updated username and/or password
userRouter.put('/updateUser', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { username, password, user } = req?.body;
        const { _id } = user;

        if (!user._id) {
            res.status(400).send(StatusMessage.Unauthorized);
            return;
        }

        if (username) {
            await collections.users.updateOne({ _id: user._id }, { $set: { username } })
        }
        if (password) {
            await collections.users.updateOne({ _id: user._id }, { $set: { password } })
        }

        const updatedUser = await collections.users.findOne({ _id });

        // When the user data is updated, the old token is no longer valid, so we send a new token to the user:
        const token = jwt.sign({ _id: updatedUser._id, username: updatedUser.username }, 'secretkey');
        res.cookie('token', token, {})

        res.status(200).send({ username: updatedUser.username, token });
    }
    catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
})

// GET get account data for account page
userRouter.get('/getAccounData', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { _id } = req.body.user;
        const { username } = req.body;

        if (username || _id) {
            res.status(200).send({ username, _id });
            return;
        }
        res.status(404).send('Not found');
    }
    catch (error) {
        res.status(500).send(error);
    }
})
