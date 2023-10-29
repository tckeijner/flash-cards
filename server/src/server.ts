import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './database/database';
import { userRouter } from "./user/user.routes";
import { deckRouter } from "./deck/deck.routes";
import { setJwtSecret } from "./generateJwtSecret";
import * as process from "process";

setJwtSecret();
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
    console.error('ATLAS_URI not found in .env');
    process.exit(1);
}

connectToDatabase(ATLAS_URI)
    .then(() => {
        const app = express();
        app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
        app.use(cookieParser());

        app.use('/users', userRouter);
        app.use('/decks', deckRouter);

        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
        });

    })
    .catch(error => console.error(error));
