import * as jwt from 'jsonwebtoken';
import { RequestHandler } from "express";

/**
 * Request handler function that verifies the decoded token as user info to the request.
 * @param req
 * @param res
 * @param next
 */
export const verifyJwt: RequestHandler = (req, res, next) => {
    const encryptedToken = req.headers?.['authorization'];
    if (encryptedToken) {
        // Result of the decryption should be the user info:
        const token = jwt.verify(encryptedToken, 'secretkey') as jwt.JwtPayload;
        req.body = {
            ...req.body,
            user: token
        }
        next();
    } else {
        res.sendStatus(403);
    }
}
