import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppRoutingModule } from '../../app-routing.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { selectedDeck } from '../../state/decks/decks.selectors';
import { ReviewDeckComponent } from './review-deck.component';

describe('ReviewDeckComponent', () => {
    let component: ReviewDeckComponent;
    let fixture: ComponentFixture<ReviewDeckComponent>;
    let mockRoute: ActivatedRoute;
    let mockStore: MockStore;
    let routeSpy: jasmine.Spy<(name: string) => string | null>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReviewDeckComponent],
            imports: [
                CommonModule,
                RouterLink,
                NavbarModule,
                AppRoutingModule,
            ],
            providers: [
                provideMockStore(),
            ],
        });

        mockRoute = TestBed.inject(ActivatedRoute);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ReviewDeckComponent);
        component = fixture.componentInstance;

        mockStore.overrideSelector(selectedDeck, {
            _id: '123abc',
            name: 'Some Deck Name',
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
        })
        routeSpy = spyOn(mockRoute.snapshot.paramMap, 'get').and.returnValue('123abc');
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.inject(MockStore)?.resetSelectors();
    });

    it('should create the ReviewDeckComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should get the route params', fakeAsync(() => {
        expect(routeSpy).toHaveBeenCalledWith('id');
        expect(routeSpy).toHaveBeenCalledWith('id');
    }));

    it('should increment the cards by one on nextCard', () => {
        component.nextCard();
        expect(component.currentCardIndex).toBe(1);
    })

    it('should decrement the cards by one on previousCard', () => {
        component.currentCardIndex = 2;
        component.previousCard();
        expect(component.currentCardIndex).toBe(1);
    })

    it('should get the current and next card',() => {
        expect(component.currentCard?.front).toEqual('front1')
        component.nextCard();
        expect(component.currentCard?.front).toEqual('front2')
    })
});
