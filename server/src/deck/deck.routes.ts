import * as express from 'express';
import { collections } from '../database/database';
import { ObjectId } from "mongodb";

export const deckRouter = express.Router();
deckRouter.use(express.json());

deckRouter.post('/', async (req, res) => {
    try {
        const { userId, token, deck } = req?.body;
        const isTokenValid = (await collections.users.findOne({ userId })).token === token ;
        if (!isTokenValid) {
            res.status(401).send('Unauthorized');
        } else {
            const result = await collections.users.updateOne(
                { userId },
                { $push: { decks: { ...deck, _id: new ObjectId()} } }
            );
            if (result.acknowledged) {
                res.status(201).send(`Created new deck with name ${req.body.name}`);
            } else {
                res.status(500).send('Deck creation failed.')
            }
        }
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

deckRouter.get('/checkAvailability/:deckname', async (req, res) => {
    try {
        const { deckname } = req?.params;
        const { username, token } = req?.body;
        const user = await collections.users.findOne({ username, token });
        const isDecknameTaken = user.decks.some(deck => deck.name === deckname);
        res.status(200).send(!isDecknameTaken);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})
