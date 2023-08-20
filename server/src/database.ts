import * as mongodb from 'mongodb';
import {User} from './user';

export const collections: {
    users?: mongodb.Collection<User>
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

    collections.users = db.collection<User>('users');
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['username', 'password'],
            additionalProperties: false,
            properties: {
                _id: {},
                username: {
                    bsonType: 'string',
                    description: "'username' is required and is a string",
                    minLength: 5
                },
                position: {
                    bsonType: 'string',
                    description: "'password' is required and is a string",
                    minLength: 5
                },
            },
        },
    };

    await db.command({
        collMod: 'user',
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection('users', {validator: jsonSchema});
        }
    });
}
