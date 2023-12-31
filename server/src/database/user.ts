import * as mongodb from 'mongodb';

/**
 * Manages the database instance. For this specific purpose, I have chosen for only one collection
 * called User, where all other data is grouped under the user. Another possibility would have been to manage two
 * collections (users and decks) and connect them with foreign IDs, but this is really only necessary for large collections
 * of data, where for example decks can belong to multiple users. For smaller collections, this appears
 * to be the best practice.
 * @param db
 */
export async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['username', 'password'],
            additionalProperties: false,
            properties: {
                _id: {},
                refreshTokenIssuedAt: {
                    bsonType: 'number',
                    description: 'refresh token creation timestamp',
                },
                username: {
                    bsonType: 'string',
                    description: 'username\' is required and is a string',
                    minLength: 5,
                },
                password: {
                    bsonType: 'string',
                    description: 'password\' is required and is a string',
                    minLength: 5,
                },
                decks: {
                    bsonType: 'array',
                    description: 'list of decks',
                    minItems: 0,
                    items: {
                        bsonType: 'object',
                        description: 'Deck\' is required and is an object',
                        required: ['name'],
                        properties: {
                            _id: 'ObjectId',
                            name: {
                                bsonType: 'string',
                                description: 'deck name is required and is a string',
                            },
                            cards: {
                                bsonType: 'array',
                                description: 'List of cards',
                                items: {
                                    bsonType: 'object',
                                    description: 'Card with back and front',
                                    required: ['front', 'back'],
                                    properties: {
                                        _id: 'ObjectId',
                                        front: {
                                            bsonType: 'string',
                                            description: 'Front of the card',
                                        },
                                        back: {
                                            bsonType: 'string',
                                            description: 'Back of the card',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    await db.command({
        collMod: 'user',
        validator: jsonSchema,
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection('users', { validator: jsonSchema });
        }
    });
}
