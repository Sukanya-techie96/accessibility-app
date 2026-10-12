import { Injectable, signal, computed, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Artwork, CartItem } from '../models/artwork.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private announcer = inject(LiveAnnouncer);
  
  readonly cartItems = signal<CartItem[]>([]);
  readonly isDrawerOpen = signal<boolean>(false);

  readonly totalItemCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.artwork.price * item.quantity), 0)
  );

  getQuantity(artworkId: string): number {
    const item = this.cartItems().find(i => i.artwork.id === artworkId);
    return item ? item.quantity : 0;
  }

  addToCart(artwork: Artwork) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.artwork.id === artwork.id);
      if (existing) {
        return items.map(i => i.artwork.id === artwork.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { artwork, quantity: 1 }];
    });
    this.announcer.announce(`${artwork.title} added to cart. Quantity is now 1.`, 'assertive');
  }

  increaseQuantity(artworkId: string, title: string) {
    this.cartItems.update(items => 
      items.map(i => i.artwork.id === artworkId ? { ...i, quantity: i.quantity + 1 } : i)
    );
    const updatedQty = this.getQuantity(artworkId);
    this.announcer.announce(`Increased quantity of ${title} to ${updatedQty}.`, 'polite');
  }

  decreaseQuantity(artworkId: string, title: string) {
    const currentQty = this.getQuantity(artworkId);
    if (currentQty <= 1) {
      this.removeFromCart(artworkId, title);
    } else {
      this.cartItems.update(items => 
        items.map(i => i.artwork.id === artworkId ? { ...i, quantity: i.quantity - 1 } : i)
      );
      this.announcer.announce(`Decreased quantity of ${title} to ${currentQty - 1}.`, 'polite');
    }
  }

  removeFromCart(artworkId: string, title: string) {
    this.cartItems.update(items => items.filter(i => i.artwork.id !== artworkId));
    this.announcer.announce(`${title} removed from cart.`, 'polite');
  }

  toggleDrawer() {
    this.isDrawerOpen.update(state => !state);
  }
}