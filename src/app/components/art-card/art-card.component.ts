import { Component, input, inject } from '@angular/core';
import { Artwork } from '../../models/artwork.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-art-card',
  standalone: true,
  template: `
    <article class="card h-100 border-2 border-dark shadow-sm">
      <img [src]="artwork().imageUrl" class="card-img-top object-fit-cover" height="200" [alt]="artwork().altText" />
      
      <div class="card-body d-flex flex-column">
        <!-- Neutral Dark Badge -->
        <span class="badge bg-secondary text-white text-uppercase w-auto align-self-start mb-2 px-2 py-1">{{ artwork().concept }}</span>
        <h3 class="card-title h5 mb-1">{{ artwork().title }}</h3>
        <p class="card-text text-secondary mb-3">By <strong>{{ artwork().artist }}</strong></p>
        
        <p class="visually-hidden" [id]="'desc-' + artwork().id">
          Description: {{ artwork().longDescription }}
        </p>

        <div class="card-footer bg-transparent border-top border-1 pt-3 mt-auto d-flex justify-content-between align-items-center" style="min-height: 56px;">
          <span class="fs-4 fw-bold text-dark">&#36;{{ artwork().price }}</span>
          
          <div class="d-flex align-items-center justify-content-end" style="height: 38px;">
            @if (cartService.getQuantity(artwork().id) === 0) {
              <button 
                type="button"
                class="btn btn-warning d-flex align-items-center justify-content-center p-2" 
                style="height: 38px; width: 42px;"
                [attr.aria-label]="'Add ' + artwork().title + ' to shopping cart'"
                [attr.aria-describedby]="'desc-' + artwork().id"
                (click)="cartService.addToCart(artwork())">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  <line x1="12" y1="9" x2="12" y2="15"></line>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                </svg>
                <span class="visually-hidden">Add to Cart</span>
              </button>
            } @else {
              <div class="btn-group border border-2 border-dark" role="group" [attr.aria-label]="'Quantity selector for ' + artwork().title" style="height: 38px;">
                <button 
                  type="button" 
                  class="btn btn-dark fw-bold px-2 py-0" 
                  [attr.aria-label]="'Decrease quantity for ' + artwork().title"
                  (click)="cartService.decreaseQuantity(artwork().id, artwork().title)">
                  -
                </button>
                <span class="btn btn-dark disabled text-white fw-bold px-2 py-0 opacity-100 d-flex align-items-center justify-content-center" style="min-width: 32px;">
                  {{ cartService.getQuantity(artwork().id) }}
                </span>
                <button 
                  type="button" 
                  class="btn btn-dark fw-bold px-2 py-0" 
                  [attr.aria-label]="'Increase quantity for ' + artwork().title"
                  (click)="cartService.increaseQuantity(artwork().id, artwork().title)">
                  +
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </article>
  `
})
export class ArtCardComponent {
  artwork = input.required<Artwork>();
  cartService = inject(CartService);
}