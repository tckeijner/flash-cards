import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Deck } from "../../decks/deck.model";

export const DecksActions = createActionGroup({
    source: 'Decks',
    events: {
        'Load Decks': emptyProps(),
        'Load Decks Success': props<{ decks: Deck[] }>(),
        'Load Decks Failed': props<{ error: string }>()
    }
})
