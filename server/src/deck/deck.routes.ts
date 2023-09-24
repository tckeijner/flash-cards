import * as express from 'express';
import { collections } from '../database/database';
import { ObjectId } from "mongodb";

export const deckRouter = express.Router();
deckRouter.use(express.json());

deckRouter.get('/', async (req, res) => {
    try {
        const token = req?.headers.authorization;
        const user = await collections.users.findOne({ token });
        if (!user) { res.status(401).send('Unauthorized'); }
        res.status(200).send(user.decks);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

deckRouter.post('/', async (req, res) => {
    try {
        const { deck } = req?.body;
        const token = req?.headers.authorization;
        const user = await collections.users.findOne({ token });
        if (!user) {
            res.status(401).send('Unauthorized');
        } else {
            const result = await collections.users.updateOne(
                { _id: user._id },
                { $push: { decks: { ...deck, _id: new ObjectId()} } }
            );
            if (result.acknowledged) {
                res.status(201).send(`Created new deck with name ${deck.name}`);
            } else {
                res.status(500).send('Deck creation failed.')
            }
        }
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

deckRouter.get('/checkAvailability/:name', async (req, res) => {
    try {
        const { name } = req?.params;
        const token = req?.headers.authorization;
        const user = await collections.users.findOne({ token });
        if (!user) {
            res.status(401).send('Unauthorized');
        }
        const isDecknameTaken = user.decks.some(deck => deck.name === name);
        res.status(200).send(!isDecknameTaken);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
})
