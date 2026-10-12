import { Component, inject, Output, EventEmitter, input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header role="banner" class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-2 border-secondary px-3 px-md-4 py-3">
      <div class="container p-0 d-flex justify-content-between align-items-center">
        
        <h1 class="navbar-brand fs-4 fw-bold m-0" style="cursor: pointer;" (click)="navigate.emit('catalog')">
          Art Gallery
        </h1>
        
        <nav aria-label="Main Navigation" class="d-flex align-items-center gap-3">
          <!-- Distinct Active State Links -->
          <div class="d-flex align-items-center gap-1">
            <button 
              type="button" 
              class="btn btn-link text-warning fw-bold text-decoration-none border-2 px-3 py-1 rounded-0"
              [class.border-white]="activeView() === 'catalog'"
              [attr.aria-current]="activeView() === 'catalog' ? 'page' : null"
              (click)="navigate.emit('catalog')">
              Catalog
            </button>
            
            <button 
              type="button" 
              class="btn btn-link text-warning fw-bold text-decoration-none border-2 px-3 py-1 rounded-0"
              [class.border-white]="activeView() === 'todo'"
              [attr.aria-current]="activeView() === 'todo' ? 'page' : null"
              (click)="navigate.emit('todo')">
              To Do
            </button>

            <button 
              type="button" 
              class="btn btn-link text-warning fw-bold text-decoration-none border-2 px-3 py-1 rounded-0"
              [class.border-white]="activeView() === 'contact'"
              [attr.aria-current]="activeView() === 'contact' ? 'page' : null"
              (click)="navigate.emit('contact')">
              Contact Us
            </button>
          </div>

          <!-- Auth Controls -->
          <div class="d-flex align-items-center gap-2">
              @if (authService.currentUser(); as user) {
              <span class="text-light d-none d-sm-inline small">Hello, <strong>{{ user.fullName }}</strong></span>
              <button type="button" class="btn btn-outline-danger btn-sm fw-bold" (click)="authService.logout()">
                Sign Out
              </button>
            } @else {
              <button type="button" class="btn btn-outline-light btn-sm fw-bold" (click)="authService.openModal('login')">
                Sign In
              </button>
            }
          </div>
          

          <!-- Cart Button -->
          <button 
            type="button"
            class="btn btn-warning position-relative fw-bold d-flex align-items-center gap-2 ms-1" 
            (click)="cartService.toggleDrawer()"
            [attr.aria-expanded]="cartService.isDrawerOpen()"
            aria-controls="cart-drawer-panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <line x1="12" y1="9" x2="12" y2="15"></line>
              <line x1="9" y1="12" x2="15" y2="12"></line>
            </svg>
            <span class="d-none d-sm-inline">Cart</span>
            <span class="badge bg-dark text-white rounded-pill" [attr.aria-label]="cartService.totalItemCount() + ' items in cart'">
              {{ cartService.totalItemCount() }}
            </span>
          </button>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  activeView = input.required<'catalog' | 'contact' | 'todo'>();
  @Output() navigate = new EventEmitter<'catalog' | 'contact' | 'todo'>();
}