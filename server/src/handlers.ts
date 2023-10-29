import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError, VerifyErrors } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as process from 'process';
import { collections } from './database/database';

/**
 * These handler functions are generic functions that can be added to any request method. They contain logic that is generic and used
 * in most requests, like token verification, and getting user data from the DB
 */

/**
 * Request handler function that verifies the decoded token as user info to the request.
 * @param req
 * @param res
 * @param next
 */
export const verifyAccessTokenHandler: RequestHandler = (req, res, next) => {
    try {
        const encryptedToken = req.headers?.['token'] as string;
        if (encryptedToken) {
            jwt.verify(encryptedToken, process.env.JWT_SECRET_KEY, (err: VerifyErrors, token: jwt.JwtPayload) => {
                if (err && err instanceof TokenExpiredError) {
                    // If token is expired, send 401 to the client, it will then request a new token
                    res.status(401).send('Expired');
                } else if (err) {
                    // In of another error, send a normal 401
                    res.sendStatus(401);
                } else {
                    // Result of the decryption should be the user info:
                    req.body = { ...req.body, token };
                    next();
                }
            });
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        res.sendStatus(500);
    }
};

/**
 * Uses the decoded token to find the user in the DB and adds it to the request.
 * @param req
 * @param res
 * @param next
 */
export const getUserFromDecodedTokenHandler: RequestHandler = async (req, res, next) => {
    try {
        const _id = new ObjectId(req.body.token._id);
        req.body.user = await collections.users.findOne({ _id });
        next();
    } catch (e) {
        res.sendStatus(500);
    }
};

export const verifyToken = (encryptedToken: string): jwt.JwtPayload => {
    return jwt.verify(encryptedToken, process.env.JWT_SECRET_KEY) as jwt.JwtPayload;
};

export const signAccessToken = (user: { _id: string, username: string }) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

export const signRefreshToken = (user: { _id: string, username: string }) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};
