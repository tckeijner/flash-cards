import * as express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../database/database';
import { getUserFromDecodedTokenHandler, verifyAccessTokenHandler } from '../handlers';

export const deckRouter = express.Router();
deckRouter.use(express.json());

// GET Get all decks belonging to a user
deckRouter.get('/', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { user } = req?.body;
        if (!user) {
            res.sendStatus(401);
        } else {
            res.status(200).send(user.decks ?? []);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

// POST Add a new deck to a user
deckRouter.post('/', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { deck, user } = req?.body;
        deck._id = new ObjectId();
        deck.cards = deck.cards?.length ? deck.cards : [];
        const { _id } = user;

        if (!user) {
            res.sendStatus(401);
        } else {
            const result = await collections.users.updateOne(
                { _id },
                { $push: { decks: deck } }
            );

            if (result.acknowledged) {
                const updatedUser = await collections.users.findOne({ _id });
                res.status(200).send(updatedUser.decks);
            } else {
                res.sendStatus(500);
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// DELETE Delete specific deck
deckRouter.delete('/:id', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { _id } = req?.body?.user;
        const deckId = new ObjectId(req?.params?.id);
        if (_id) {
            const result = await collections.users.updateOne(
                { _id },
                { $pull: { decks: { _id: deckId } } },
            );
            if (result) {
                const updatedUser = await collections.users.findOne({ _id });
                res.status(200).send(updatedUser.decks);
            }
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// PUT Update a deck
deckRouter.put('/', verifyAccessTokenHandler, getUserFromDecodedTokenHandler, async (req, res) => {
    try {
        const { _id } = req.body?.user;
        const { deck } = req.body;
        deck._id = new ObjectId(deck._id);

        if (_id) {
            const result = await collections.users.updateOne(
                { _id },
                { $set: { 'decks.$[deck]': deck } },
                { arrayFilters: [{ 'deck._id': new ObjectId(deck._id) }] },
            );
            const updatedUser = await collections.users.findOne({ _id });
            if (result) {
                res.status(200).send(updatedUser.decks);
                return;
            }
            res.sendStatus(500);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
