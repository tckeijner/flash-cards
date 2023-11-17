import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AccountService } from '../account.service';
import { CreateAccountComponent } from './create-account.component';

describe('CreateAccountComponent', () => {
    let component: CreateAccountComponent;
    let fixture: ComponentFixture<CreateAccountComponent>;
    let mockAccountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        mockAccountService = jasmine.createSpyObj(['isUsernameAvailable'])
        TestBed.configureTestingModule({
            declarations: [CreateAccountComponent],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: AccountService, useValue: mockAccountService }
            ]
        });

        fixture = TestBed.createComponent(CreateAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the CreateAccountComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should create the form', () => {
        expect(component.form).toBeTruthy();
        expect(component.form.controls?.['username']).toBeTruthy();
        expect(component.form.controls?.['password']).toBeTruthy();
        expect(component.form.controls?.['passwordConfirm']).toBeTruthy();
    });

    it('should validate the form', fakeAsync(() => {
        const isUsernameAvailableSpy = mockAccountService.isUsernameAvailable.and.returnValue(of(true));
        component.form.get('username')?.setValue('SomeUsername');
        component.form.get('password')?.setValue('SomePassword3');
        component.form.get('passwordConfirm')?.setValue('SomePassword3');
        expect(isUsernameAvailableSpy).toHaveBeenCalledWith('SomeUsername');
        expect(component.form.valid).toBeTrue();
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
