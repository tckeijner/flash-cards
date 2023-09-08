import * as mongodb from 'mongodb';

export interface User {
    username: string;
    password: string;
    _id?: mongodb.ObjectId;
}

export interface AuthenticationToken {
    _id?: mongodb.ObjectId;
    userId: mongodb.ObjectId;
    token: string;
}
