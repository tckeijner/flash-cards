import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { AccountService } from '../account.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let mockAccountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        mockAccountService = jasmine.createSpyObj(['isUsernameAvailable']);
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                CommonModule,
                HttpClientTestingModule,
                ReactiveFormsModule,
                RouterLink,
                StoreModule.forRoot(),
            ],
            providers: [
                { provide: AccountService, useValue: mockAccountService },
            ],
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the LoginComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should create the form', () => {
        expect(component.form).toBeTruthy();
        expect(component.form.controls?.['username']).toBeTruthy();
        expect(component.form.controls?.['password']).toBeTruthy();
    });

    it('should validate the form', () => {
        component.form.get('username')?.setValue('SomeUsername');
        component.form.get('password')?.setValue('SomePassword3');
        expect(component.form.valid).toBeTrue();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
