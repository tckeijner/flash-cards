import * as mongodb from 'mongodb';
import { AuthenticationToken, User } from './user';

export const collections: {
    users?: mongodb.Collection<User>,
    authentication?: mongodb.Collection<AuthenticationToken>
} = {};

/**
 * Connects to the MongoDB flashcards cluster
 * @param uri
 */
export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db('flashcards');
    await applySchemaValidationUser(db);
    await applySchemaValidationAuthentication(db);

    collections.users = db.collection<User>('users');
    collections.authentication = db.collection<AuthenticationToken>('authentication');
}

async function applySchemaValidationUser(db: mongodb.Db) {
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

async function applySchemaValidationAuthentication(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'token'],
            additionalProperties: false,
            properties: {
                _id: {},
                userId: {
                    bsonType: 'string',
                    description: "'User ID' is required and is a string",
                },
                position: {
                    bsonType: 'objectId',
                    description: "'token' is required and is an objectId",
                },
            },
        },
    };

    await db.command({
        collMod: 'authentication',
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection('authentication', {validator: jsonSchema});
        }
    });
}
