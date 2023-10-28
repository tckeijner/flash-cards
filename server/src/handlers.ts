import * as jwt from 'jsonwebtoken';
import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database/database";
import * as process from "process";

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
export const verifyJwt: RequestHandler = (req, res, next) => {
    try {
        const encryptedToken = req.headers?.['authorization'];
        if (encryptedToken) {
            // Result of the decryption should be the user info:
            const token = jwt.verify(encryptedToken, process.env.JWT_SECRET_KEY) as jwt.JwtPayload;
            req.body = { ...req.body, token };
            next();
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.status(200).send(false)
    }
}

/**
 * Uses the decoded token to find the user in the DB and adds it to the request.
 * @param req
 * @param res
 * @param next
 */
export const getUserFromDecodedToken: RequestHandler = async (req, res, next) => {
    try {
        const _id = new ObjectId(req.body.token._id);
        req.body.user = await collections.users.findOne({ _id });
        next();
    }
    catch (e) {
        res.sendStatus(500);
    }
}
