import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppRoutingModule } from '../app-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { selectDecks } from '../state/decks/decks.selectors';
import { DecksComponent } from './decks.component';

describe('DecksComponent', () => {
    let component: DecksComponent;
    let fixture: ComponentFixture<DecksComponent>;
    let mockStore: MockStore;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DecksComponent],
            imports: [
                CommonModule,
                NavbarModule,
                AppRoutingModule,
            ],
            providers: [
                provideMockStore(),
            ],
        });

        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(DecksComponent);
        component = fixture.componentInstance;

        mockStore.overrideSelector(selectDecks, [{
            _id: '123abc',
            name: 'Deck 1',
            cards: [
                {
                    front: 'front1',
                    back: 'back1',
                },
                {
                    front: 'front2',
                    back: 'back2',
                },
            ],
        }, {
            _id: '456def',
            name: 'Deck 2',
            cards: [
                {
                    front: 'ffff',
                    back: 'bbbbb',
                },
                {
                    front: 'ffff',
                    back: 'vvvvv',
                },
            ],
        }]);

        fixture.detectChanges();
    });


    it('should create the DecksComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should load the decks', () => {
        expect(fixture.debugElement.queryAll(By.css('.card')).length).toBe(2);
        expect(fixture.debugElement.queryAll(By.css('.card-title'))[0].nativeElement.textContent).toEqual('Deck 1');
        expect(fixture.debugElement.queryAll(By.css('.card-title'))[1].nativeElement.textContent).toEqual('Deck 2');
    });
});
