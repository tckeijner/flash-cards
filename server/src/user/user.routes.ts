import * as express from 'express';
import { collections } from '../database/database';
import * as jwt from 'jsonwebtoken';
import {
    getUserFromDecodedTokenHandler,
    verifyToken,
    verifyAccessTokenHandler,
    signAccessToken,
    signRefreshToken
} from "../handlers";
import * as process from "process";
import { ObjectId } from "mongodb";

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
        res.status(500).send(error);
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
            res.status(201).send(`User created with username: ${user.username}`);
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// POST to log the user in
userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await collections.users.findOne({ username });
        if (!user) {
            res.sendStatus(404);
        } else if (user.password !== password) {
            res.status(401).send('Incorrect password.');
        } else if (user.password === password) {
            // Create access token and refresh token:
            const token = signAccessToken({ _id: user._id.toString(), username: user.username });
            const refreshToken = signRefreshToken({ _id: user._id.toString(), username: user.username });

            // store the iat (issuedAt) of the refreshToken in the DB, for later verification
            const { iat } = verifyToken(refreshToken);
            await collections.users.updateOne({ _id: user._id }, { '$set': { refreshTokenIssuedAt: iat }});

            // Send success status with user info and tokens
            res.status(200).send({ username: user.username, userId: user._id, token, refreshToken });
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

userRouter.post('/refreshToken', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        // If no refresh token, return Bad Request
        if (!refreshToken) {
            res.sendStatus(400);
            return;
        }

        // Get the decoded information from the jwt token, find the user and also compare refresh token issue date for validity
        const { _id, username, iat } = verifyToken(refreshToken);
        const user = await collections.users.findOne({ _id: new ObjectId(_id), username, refreshTokenIssuedAt: iat })

        if (user) {
            // Refresh tokens should be single use, so make a new token
            const refreshToken = signRefreshToken({ username, _id })

            // store iat (issued at) with the user, so it can be compared again upon refresh
            const { iat } = verifyToken(refreshToken);
            await collections.users.updateOne({ _id: user._id }, { '$set': { refreshTokenIssuedAt: iat }});

            // create a fresh access token
            const token = signAccessToken({ username, _id });

            // send the response with the new access token and the new refresh token
            res.status(200).send({ token, refreshToken });
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET check if user is already authenticated
userRouter.get('/isAuthenticated', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        // Only checks if the token is still valid.
        const { user } = req.body;
        if (user) {
            res.status(200).send(true);
            return;
        }
        res.status(200).send(false);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

// PUT updated username and/or password
userRouter.put('/updateUser', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { username, password, user } = req?.body;
        const { _id } = user;

        if (!user._id) {
            res.sendStatus(400);
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
        const token = jwt.sign({ _id: updatedUser._id, username: updatedUser.username }, process.env.JWT_SECRET_KEY);
        res.cookie('token', token, {})

        res.status(200).send({ username: updatedUser.username, token });
    }
    catch (error) {
        res.status(500).send(error);
    }
})

// GET get account data for account page
userRouter.get('/getAccountData', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { _id, username } = req.body.user;

        if (username || _id) {
            res.status(200).send({ username, _id });
            return;
        }
        res.sendStatus(404);
    }
    catch (error) {
        res.status(500).send(error);
    }
})
