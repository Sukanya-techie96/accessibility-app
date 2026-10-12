import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="container py-4 py-md-5" aria-labelledby="contact-heading">
      <div class="row g-4 g-lg-5 align-items-start">
        
        <div class="col-12 col-md-6">
          <h2 id="contact-heading" class="h3 fw-bold mb-4">Send us an email!</h2>
          
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="mb-3">
              <label for="contact-name" class="form-label text-secondary small fw-semibold">
                Your Name <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input 
                id="contact-name" 
                type="text" 
                class="form-control border-secondary-subtle" 
                [class.is-invalid]="isInvalid('name')"
                formControlName="name"
                placeholder="Enter Your Name"
                [attr.aria-invalid]="isInvalid('name')"
                [attr.aria-describedby]="isInvalid('name') ? 'name-error' : null" />
              @if (isInvalid('name')) {
                <div id="name-error" class="invalid-feedback fw-bold" role="alert">Your name is required.</div>
              }
            </div>

            <div class="mb-3">
              <label for="contact-email" class="form-label text-secondary small fw-semibold">
                Email <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input 
                id="contact-email" 
                type="email" 
                class="form-control border-secondary-subtle" 
                [class.is-invalid]="isInvalid('email')"
                formControlName="email"
                placeholder="Enter Email"
                [attr.aria-invalid]="isInvalid('email')"
                [attr.aria-describedby]="isInvalid('email') ? 'email-error' : null" />
              @if (isInvalid('email')) {
                <div id="email-error" class="invalid-feedback fw-bold" role="alert">A valid email address is required.</div>
              }
            </div>

            <div class="mb-4">
              <label for="contact-message" class="form-label text-secondary small fw-semibold">
                Your Message <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <textarea 
                id="contact-message" 
                rows="5" 
                class="form-control border-secondary-subtle" 
                [class.is-invalid]="isInvalid('message')"
                formControlName="message"
                placeholder="Enter Your Message"
                [attr.aria-invalid]="isInvalid('message')"
                [attr.aria-describedby]="isInvalid('message') ? 'message-error' : null"></textarea>
              @if (isInvalid('message')) {
                <div id="message-error" class="invalid-feedback fw-bold" role="alert">Please enter a message before sending.</div>
              }
            </div>

            <button type="submit" class="btn btn-dark px-4 fw-bold">
              Send Message
            </button>
          </form>
        </div>

        <div class="col-12 col-md-6 ps-md-4 ps-lg-5">
          <h2 class="h3 fw-bold mb-4">Other Contact Information</h2>

          <div class="d-flex align-items-start mb-4">
            <div class="me-3 text-dark" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            </div>
            <div>
              <h3 class="h5 fw-bold mb-1">Hospital Address:</h3>
              <p class="text-secondary mb-0 small lh-sm">12 Chicago Road<br>Suite 14<br>Chicago, Illionis 60007</p>
            </div>
          </div>

          <div class="d-flex align-items-start mb-4">
            <div class="me-3 text-dark" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="h5 fw-bold mb-1">Work Hours</h3>
              <p class="text-secondary mb-0 small lh-sm">Monday - Friday: 7am-6pm<br>Saturday & Sunday: Closed</p>
            </div>
          </div>

          <div class="d-flex align-items-start mb-4">
            <div class="me-3 text-dark" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="h5 fw-bold mb-1">Phone Number</h3>
              <p class="mb-0 small">
                <a href="tel:1234578990" class="text-dark text-decoration-underline fw-bold">123-457-8990</a>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  `
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private announcer = inject(LiveAnnouncer);

  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]]
  });

  isInvalid(controlName: string): boolean {
    const ctrl = this.contactForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.announcer.announce('Thank you! Your contact message has been sent successfully.', 'assertive');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
      this.announcer.announce('Form validation failed. Please correct the highlighted errors.', 'assertive');
    }
  }
}