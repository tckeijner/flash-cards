import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppRoutingModule } from '../../app-routing.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { selectedDeck } from '../../state/decks/decks.selectors';
import { EditDeckComponent } from './edit-deck.component';

describe('EditDeckComponent', () => {
    let component: EditDeckComponent;
    let fixture: ComponentFixture<EditDeckComponent>;
    let mockRoute: ActivatedRoute;
    let mockStore: MockStore;
    let routeSpy: jasmine.Spy<(name: string) => string | null>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditDeckComponent],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                NavbarModule,
                AppRoutingModule,
            ],
            providers: [
                provideMockStore(),
            ],
        });
        mockRoute = TestBed.inject(ActivatedRoute);
        mockStore = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(EditDeckComponent);
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

    it('should create the EditDeckComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should get the route params', fakeAsync(() => {
        expect(routeSpy).toHaveBeenCalledWith('id');
    }));

    it('should build the form using the card data', () => {
        expect(component.form.get('name')?.value).toEqual('Some Deck Name')
        expect(component.form.get('cards')?.value[0].front).toEqual('front1')
        expect(component.form.get('cards')?.value[0].back).toEqual('back1')
        expect(component.form.get('cards')?.value[1].front).toEqual('front2')
        expect(component.form.get('cards')?.value[1].back).toEqual('back2')
    })
});
