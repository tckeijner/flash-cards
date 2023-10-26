import * as mongodb from 'mongodb';

export interface UserModels {
    _id?: mongodb.ObjectId;
    username: string;
    password: string;
    decks?: Deck[];
}

export interface Deck {
    _id?: mongodb.ObjectId;
    name: string;
    cards: Card[];
}

export interface Card {
    _id?: mongodb.ObjectId;
    front: string;
    back: string;
}
