import * as mongodb from 'mongodb';
import { UserModels } from './user.models';
import { applySchemaValidation } from './user';

export const collections: {
    users?: mongodb.Collection<UserModels>;
} = {};

/**
 * Connects to the MongoDB flashcards cluster
 * @param uri
 */
export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db('flashcards');
    await applySchemaValidation(db);

    collections.users = db.collection<UserModels>('users');
}



