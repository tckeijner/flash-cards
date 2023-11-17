import { CommonModule } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { AppRoutingModule } from '../../app-routing.module';
import { NavbarModule } from '../../navbar/navbar.module';
import { selectAccount } from '../../state/account/account.selectors';
import { AccountService } from '../account.service';
import { ManageAccountComponent } from './manage-account.component';

describe('ManageAccountComponent', () => {
    let component: ManageAccountComponent;
    let fixture: ComponentFixture<ManageAccountComponent>;
    let mockAccountService: jasmine.SpyObj<AccountService>;
    let isUsernameAvailableSpy: jasmine.Spy<(username: string) => Observable<Object>>;
    let mockStore: MockStore;

    beforeEach(() => {
        mockAccountService = jasmine.createSpyObj(['isUsernameAvailable']);
        isUsernameAvailableSpy = mockAccountService.isUsernameAvailable.and.returnValue(of(true));

        TestBed.configureTestingModule({
            declarations: [ManageAccountComponent],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                NavbarModule,
                AppRoutingModule,
            ],
            providers: [
                { provide: AccountService, useValue: mockAccountService },
                provideMockStore({
                    selectors: [{
                        selector: selectAccount,
                        value: {
                            username: 'SomeUser',
                            userId: '123abc',
                        },
                    }],
                }),
            ],
        });

        fixture = TestBed.createComponent(ManageAccountComponent);
        mockStore = TestBed.inject(MockStore);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the ManageAccountComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should create the username form', () => {
        expect(component.usernameForm).toBeTruthy();
        expect(component.usernameForm.get('username')).toBeTruthy();
    });

    it('should create the password form', () => {
        expect(component.passwordForm).toBeTruthy();
        expect(component.passwordForm.get('password')).toBeTruthy();
        expect(component.passwordForm.get('passwordConfirm')).toBeTruthy();
    });

    it('should validate the username form', fakeAsync(() => {
        component.usernameForm.get('username')?.setValue('SomeUsername');
        expect(isUsernameAvailableSpy).toHaveBeenCalledWith('SomeUsername');
        expect(component.usernameForm.valid).toBeTrue();
    }));

    it('should save the username form when it is valid', fakeAsync(() => {
        const dispatchSpy = spyOn(mockStore, 'dispatch');
        component.usernameForm.get('username')?.setValue('SomeUsername');
        component.saveForm(component.usernameForm);
        expect(dispatchSpy).toHaveBeenCalled();
    }));

    it('should save the password form when it is valid', fakeAsync(() => {
        const dispatchSpy = spyOn(mockStore, 'dispatch');
        component.passwordForm.get('password')?.setValue('SomePassword3');
        component.passwordForm.get('passwordConfirm')?.setValue('SomePassword3');
        component.saveForm(component.passwordForm);
        expect(dispatchSpy).toHaveBeenCalled();
    }));

    it('should not save the password form when it is invalid', fakeAsync(() => {
        const dispatchSpy = spyOn(mockStore, 'dispatch');
        component.passwordForm.get('password')?.setValue('SomePassword3');
        component.passwordForm.get('passwordConfirm')?.setValue('SomePassword4');
        component.saveForm(component.passwordForm);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
