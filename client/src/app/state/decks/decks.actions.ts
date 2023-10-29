import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Deck } from '../../decks/deck.model';

export const DecksActions = createActionGroup({
    source: 'Decks',
    events: {
        'Load Decks': emptyProps(),
        'Load Decks Success': props<{ decks: Deck[] }>(),
        'Load Decks Failed': props<{ error: string }>(),
        'Create Deck': props<{ name: string }>(),
        'Create Deck Success': props<{ decks: Deck[] }>(),
        'Create Deck Failed': props<{ error: string }>(),
        'Update Deck': props<{ deck: Deck }>(),
        'Update Deck Success': props<{ decks: Deck[] }>(),
        'Update Deck Failed': props<{ error: string }>(),
        'Remove Deck': props<{ id: string }>(),
        'Remove Deck Success': props<{ decks: Deck[] }>(),
        'Remove Deck Failed': props<{ error: string }>(),
        'Clear Deck State': emptyProps(),
    },
});
