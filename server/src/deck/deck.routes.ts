import * as express from 'express';
import { collections } from '../database/database';
import { ObjectId } from "mongodb";
import { StatusMessage } from "../enums";
import { getUserFromDecodedToken, verifyJwt } from "../handlers";

export const deckRouter = express.Router();
deckRouter.use(express.json());

deckRouter.get('/', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { user } = req?.body;
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

deckRouter.post('/', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { name, user } = req?.body;
        const { _id } = user;

        if (!user) {
            res.status(401).send(StatusMessage.Unauthorized);
        } else {
            const result = await collections.users.updateOne(
                { _id },
                { $push: { decks: { _id: new ObjectId(), name, cards: []} } }
            );
            if (result.acknowledged) {
                const updatedUser = await collections.users.findOne({ _id });
                res.status(200).send(updatedUser.decks);
            } else {
                res.status(500).send(StatusMessage.InternalServerError);
            }
        }
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})

deckRouter.delete('/:id', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { _id } = req?.body?.user;
        const deckId = new ObjectId(req?.params?.id);
        if (_id) {
            const result = await collections.users.updateOne(
                { _id },
                { $pull: { decks: { _id: deckId } } }
            );
            if (result) {
                const updatedUser = await collections.users.findOne({ _id })
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

deckRouter.put('/', verifyJwt, getUserFromDecodedToken, async (req, res) => {
    try {
        const { _id } = req.body?.user
        const { deck } = req.body;
        deck._id = new ObjectId(deck._id);

        if (_id) {
            const result = await collections.users.updateOne(
                { _id },
                { $set: { 'decks.$[deck]': deck } },
                { arrayFilters: [{ 'deck._id': new ObjectId(deck._id) }] }
            )
            const updatedUser = await collections.users.findOne({ _id })
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
