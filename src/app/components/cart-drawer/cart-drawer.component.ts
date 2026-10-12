import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  template: `
    @if (cartService.isDrawerOpen()) {
      <div class="modal-backdrop fade show" (click)="cartService.toggleDrawer()" aria-hidden="true"></div>

      <aside 
        id="cart-drawer-panel"
        role="dialog" 
        aria-modal="true"
        aria-label="Shopping Cart" 
        class="position-fixed top-0 end-0 bottom-0 bg-white border-start border-3 border-dark p-3 p-md-4 shadow-lg d-flex flex-column"
        style="width: 380px; max-width: 90vw; z-index: 1055;">
        
        <div class="d-flex justify-content-between align-items-center border-bottom border-2 border-dark pb-3">
          <h2 class="h4 m-0 fw-bold">Shopping Cart</h2>
          <button 
            type="button" 
            class="btn-close border border-2 border-dark p-2" 
            aria-label="Close shopping cart" 
            (click)="cartService.toggleDrawer()">
          </button>
        </div>

        <div class="flex-grow-1 overflow-y-auto my-3">
          @for (item of cartService.cartItems(); track item.artwork.id) {
            <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div>
                <h4 class="h6 m-0 fw-bold">{{ item.artwork.title }}</h4>
                <p class="small text-muted m-0">&#36;{{ item.artwork.price }} each</p>
              </div>

              <div class="d-flex align-items-center gap-2">
                <!-- Dark Stepper Matching Product Card UI -->
                <div class="btn-group border border-2 border-dark" role="group" [attr.aria-label]="'Quantity selector for ' + item.artwork.title" style="height: 38px;">
                  <button 
                    type="button" 
                    class="btn btn-dark fw-bold px-2 py-0" 
                    [attr.aria-label]="'Decrease quantity for ' + item.artwork.title"
                    (click)="cartService.decreaseQuantity(item.artwork.id, item.artwork.title)">
                    -
                  </button>
                  <span class="btn btn-dark disabled text-white fw-bold px-2 py-0 opacity-100 d-flex align-items-center justify-content-center" style="min-width: 32px;">
                    {{ item.quantity }}
                  </span>
                  <button 
                    type="button" 
                    class="btn btn-dark fw-bold px-2 py-0" 
                    [attr.aria-label]="'Increase quantity for ' + item.artwork.title"
                    (click)="cartService.increaseQuantity(item.artwork.id, item.artwork.title)">
                    +
                  </button>
                </div>

                <button 
                  type="button"
                  class="btn btn-danger btn-sm p-2 d-flex align-items-center justify-content-center"
                  style="height: 38px; width: 38px;"
                  [attr.aria-label]="'Delete ' + item.artwork.title + ' from shopping cart'"
                  (click)="cartService.removeFromCart(item.artwork.id, item.artwork.title)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span class="visually-hidden">Remove item</span>
                </button>
              </div>
            </div>
          } @empty {
            <p class="text-muted fst-italic py-4 text-center">Your shopping cart is empty.</p>
          }
        </div>

        @if (cartService.cartItems().length > 0) {
          <div class="border-top border-2 border-dark pt-3">
            <p class="fs-5 m-0 mb-3"><strong>Total:</strong> &#36;{{ cartService.totalPrice() }}</p>
            <button type="button" class="btn btn-dark btn-lg w-100 fw-bold border-2 border-dark">
              Proceed to Checkout
            </button>
          </div>
        }
      </aside>
    }
  `
})
export class CartDrawerComponent {
  cartService = inject(CartService);
}