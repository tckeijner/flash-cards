export interface Deck {
    _id?: string;
    name: string;
    cards: Card[]
}

export interface Card {
    front: string;
    back: string;
}
