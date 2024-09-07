import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import * as process from 'process';
import { connectToDatabase } from './database/database';
import { deckRouter } from './deck/deck.routes';
import { setJwtSecret } from './generateJwtSecret';
import { userRouter } from './user/user.routes';

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
