import { Component, inject, signal, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CdkTrapFocus],
  template: `
    @if (authService.isAuthModalOpen()) {
      <div class="modal-backdrop fade show" (click)="authService.closeModal()" aria-hidden="true"></div>

      <div 
        class="modal d-block" 
        tabIndex="-1" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
        cdkTrapFocus
        cdkTrapFocusAutoCapture="true">
        
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-2 border-dark shadow-lg">
            
            <div class="modal-header bg-light border-bottom border-2 border-dark">
              <h2 id="modal-title" class="visually-hidden">
                {{ authService.activeMode() === 'login' ? 'Sign In Dialog' : 'Create Account Dialog' }}
              </h2>

              <div 
                class="nav nav-tabs border-0 card-header-tabs" 
                role="tablist" 
                aria-label="Authentication mode"
                (keydown)="onTabKeydown($event)">
                
                <button 
                  #loginTab
                  type="button" 
                  class="nav-link border-0 text-dark fw-bold"
                  [class.border-bottom]="authService.activeMode() === 'login'"
                  [class.border-dark]="authService.activeMode() === 'login'"
                  [class.border-3]="authService.activeMode() === 'login'"
                  [class.opacity-50]="authService.activeMode() !== 'login'"
                  role="tab" 
                  [attr.tabindex]="authService.activeMode() === 'login' ? 0 : -1"
                  [attr.aria-selected]="authService.activeMode() === 'login'"
                  (click)="authService.setMode('login')">
                  Sign In
                </button>

                <button 
                  #signupTab
                  type="button" 
                  class="nav-link border-0 text-dark fw-bold"
                  [class.border-bottom]="authService.activeMode() === 'signup'"
                  [class.border-dark]="authService.activeMode() === 'signup'"
                  [class.border-3]="authService.activeMode() === 'signup'"
                  [class.opacity-50]="authService.activeMode() !== 'signup'"
                  role="tab" 
                  [attr.tabindex]="authService.activeMode() === 'signup' ? 0 : -1"
                  [attr.aria-selected]="authService.activeMode() === 'signup'"
                  (click)="authService.setMode('signup')">
                  Create Account
                </button>
              </div>

              <button 
                type="button" 
                class="btn-close" 
                aria-label="Close modal"
                (click)="authService.closeModal()">
              </button>
            </div>

            <div class="modal-body p-4">
              <!-- LOGIN FORM -->
              @if (authService.activeMode() === 'login') {
                <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" novalidate>
                  <div class="mb-3">
                    <label for="login-email" class="form-label fw-bold">Email Address <span class="text-danger">*</span></label>
                    <input 
                      #firstInput
                      id="login-email" 
                      type="email" 
                      class="form-control border-dark"
                      [class.is-invalid]="isFieldInvalid(loginForm, 'email')"
                      formControlName="email"
                      autocomplete="email"
                      placeholder="Enter Email"
                      [attr.aria-invalid]="isFieldInvalid(loginForm, 'email')"
                      [attr.aria-describedby]="isFieldInvalid(loginForm, 'email') ? 'login-email-error' : null" />
                    @if (isFieldInvalid(loginForm, 'email')) {
                      <div id="login-email-error" class="invalid-feedback fw-bold" role="alert">
                        Please enter a valid email address.
                      </div>
                    }
                  </div>

                  <div class="mb-4">
                    <label for="login-password" class="form-label fw-bold">Password <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input 
                        id="login-password" 
                        [type]="showLoginPassword() ? 'text' : 'password'" 
                        class="form-control border-dark"
                        [class.is-invalid]="isFieldInvalid(loginForm, 'password')"
                        formControlName="password"
                        autocomplete="current-password"
                        placeholder="Enter Password"
                        [attr.aria-invalid]="isFieldInvalid(loginForm, 'password')"
                        [attr.aria-describedby]="isFieldInvalid(loginForm, 'password') ? 'login-password-error' : null" />
                      
                      <button 
                        type="button" 
                        class="btn btn-outline-dark"
                        [attr.aria-label]="showLoginPassword() ? 'Hide password' : 'Show password'"
                        (click)="showLoginPassword.set(!showLoginPassword())">
                        @if (showLoginPassword()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        }
                      </button>
                    </div>
                    @if (isFieldInvalid(loginForm, 'password')) {
                      <div id="login-password-error" class="invalid-feedback fw-bold" role="alert">
                        Password is required.
                      </div>
                    }
                  </div>

                  <button type="submit" class="btn btn-dark w-100 fw-bold border-2 border-dark py-2">Sign In</button>
                </form>
              }

              <!-- SIGNUP FORM -->
              @if (authService.activeMode() === 'signup') {
                <form [formGroup]="signupForm" (ngSubmit)="onSignupSubmit()" novalidate>
                  <div class="mb-3">
                    <label for="signup-name" class="form-label fw-bold">Full Name <span class="text-danger">*</span></label>
                    <input 
                      #firstInput
                      id="signup-name" 
                      type="text" 
                      class="form-control border-dark"
                      [class.is-invalid]="isFieldInvalid(signupForm, 'fullName')"
                      formControlName="fullName"
                      autocomplete="name"
                      placeholder="Enter Full Name"
                      [attr.aria-invalid]="isFieldInvalid(signupForm, 'fullName')"
                      [attr.aria-describedby]="isFieldInvalid(signupForm, 'fullName') ? 'signup-name-error' : null" />
                    @if (isFieldInvalid(signupForm, 'fullName')) {
                      <div id="signup-name-error" class="invalid-feedback fw-bold" role="alert">
                        Full name is required.
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="signup-email" class="form-label fw-bold">Email Address <span class="text-danger">*</span></label>
                    <input 
                      id="signup-email" 
                      type="email" 
                      class="form-control border-dark"
                      [class.is-invalid]="isFieldInvalid(signupForm, 'email')"
                      formControlName="email"
                      autocomplete="email"
                      placeholder="Enter Email"
                      [attr.aria-invalid]="isFieldInvalid(signupForm, 'email')"
                      [attr.aria-describedby]="isFieldInvalid(signupForm, 'email') ? 'signup-email-error' : null" />
                    @if (isFieldInvalid(signupForm, 'email')) {
                      <div id="signup-email-error" class="invalid-feedback fw-bold" role="alert">
                        Please enter a valid email address.
                      </div>
                    }
                  </div>

                  <div class="mb-4">
                    <label for="signup-password" class="form-label fw-bold">Password (8+ chars) <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <input 
                        id="signup-password" 
                        [type]="showSignupPassword() ? 'text' : 'password'" 
                        class="form-control border-dark"
                        [class.is-invalid]="isFieldInvalid(signupForm, 'password')"
                        formControlName="password"
                        autocomplete="new-password"
                        placeholder="Enter Password"
                        [attr.aria-invalid]="isFieldInvalid(signupForm, 'password')"
                        [attr.aria-describedby]="isFieldInvalid(signupForm, 'password') ? 'signup-password-error' : null" />
                      
                      <button 
                        type="button" 
                        class="btn btn-outline-dark"
                        [attr.aria-label]="showSignupPassword() ? 'Hide password' : 'Show password'"
                        (click)="showSignupPassword.set(!showSignupPassword())">
                        @if (showSignupPassword()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        }
                      </button>
                    </div>
                    @if (isFieldInvalid(signupForm, 'password')) {
                      <div id="signup-password-error" class="invalid-feedback fw-bold" role="alert">
                        Password must be at least 8 characters long.
                      </div>
                    }
                  </div>

                  <button type="submit" class="btn btn-dark w-100 fw-bold border-2 border-dark py-2">Create Account</button>
                </form>
              }
            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class AuthModalComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  @ViewChild('loginTab') loginTab?: ElementRef<HTMLButtonElement>;
  @ViewChild('signupTab') signupTab?: ElementRef<HTMLButtonElement>;
  @ViewChild('firstInput') firstInput?: ElementRef<HTMLInputElement>;

  showLoginPassword = signal(false);
  showSignupPassword = signal(false);

  constructor() {
    // Automatically manage focus state whenever activeMode or modal state changes
    effect(() => {
      if (this.authService.isAuthModalOpen()) {
        const mode = this.authService.activeMode();
        setTimeout(() => {
          // Focus the active tab or the active first input
          if (mode === 'signup' && this.signupTab) {
            this.signupTab.nativeElement.focus();
          } else if (mode === 'login' && this.loginTab) {
            this.loginTab.nativeElement.focus();
          }
        }, 50);
      }
    });
  }

  onTabKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const newMode = this.authService.activeMode() === 'login' ? 'signup' : 'login';
      this.authService.setMode(newMode);
    }
  }

  isFieldInvalid(form: any, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email!);
      this.loginForm.reset();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      const { fullName, email } = this.signupForm.value;
      this.authService.signup(fullName!, email!);
      this.signupForm.reset();
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  signupForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
}