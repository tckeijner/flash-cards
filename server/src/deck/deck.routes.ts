import * as express from 'express';
import { collections } from '../database/database';
import { ObjectId } from "mongodb";
import { StatusMessage } from "../enums";

export const deckRouter = express.Router();
deckRouter.use(express.json());

deckRouter.get('/', async (req, res) => {
    try {
        const token = req?.headers.authorization;
        const user = await collections.users.findOne({ token });
        if (!user) {
            res.status(401).send(StatusMessage.Unauthorized);
        } else {
            res.status(200).send(user.decks ?? []);
        }
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
            res.status(401).send(StatusMessage.Unauthorized);
        } else {
            const result = await collections.users.updateOne(
                { _id: user._id },
                { $push: { decks: { ...deck, _id: new ObjectId()} } }
            );
            if (result.acknowledged) {
                res.status(200).send(StatusMessage.DeckCreated);
            } else {
                res.status(500).send(StatusMessage.InternalServerError);
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
            res.status(401).send(StatusMessage.Unauthorized);
        } else {
            const isDecknameTaken = user.decks?.some(deck => deck.name === name);
            res.status(200).send(!isDecknameTaken);
        }
    } catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
})

deckRouter.delete('/:id', async (req, res) => {
    try {
        const token = req?.headers?.authorization;
        const user = await collections.users.findOne({ token });
        const _id = new ObjectId(req?.params?.id);
        if (user) {
            const result = await collections.users.updateOne(
                {_id: user._id},
                { $pull: { decks: { _id } } }
            );
            const updatedUser = await collections.users.findOne({ token })
            if (result) {
                res.status(200).send(updatedUser.decks);
            }
        } else {
            res.status(401).send(StatusMessage.Unauthorized);
        }
    }

    catch (error) {
        res.status(500).send(StatusMessage.InternalServerError);
    }
})

deckRouter.put('/', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const deck = req.body;
        deck._id = new ObjectId(deck._id);
        const user = await collections.users.findOne({ token });
        if (user) {
            const result = await collections.users.updateOne(
                { '_id': user._id },
                { $set: { 'decks.$[deck]': deck } },
                { arrayFilters: [{ 'deck._id': new ObjectId(deck._id) }] }
            )
            const updatedUser = await collections.users.findOne({ token })
            if (result) {
                res.status(200).send(updatedUser.decks);
                return;
            }
            res.status(500).send(StatusMessage.InternalServerError);
        }
    } catch (error) {
        res.status(500).send(StatusMessage.InternalServerError)
    }
})
