import { Component, Input } from '@angular/core';
import { BaseModal } from '../../modal/base-modal';
import { DecksActions } from '../../state/decks/decks.actions';
import { isDeckRemoved } from '../../state/decks/decks.selectors';
import { filter, first } from 'rxjs';

@Component({
    selector: 'app-delete-deck',
    imports: [],
    templateUrl: 'delete-deck.component.html'
})
export class DeleteDeckComponent extends BaseModal {
    @Input() id: string;

    onClickSave() {
        this.store.dispatch(DecksActions.removeDeck({ id: this.id }));
        // Subscribe to result
        this.store.select(isDeckRemoved).pipe(
            filter(isRemoved => isRemoved),
            first(),
        ).subscribe(() => {
            this.activeModal.close('OK')
        });
    }
}
