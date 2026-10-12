import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { ArtCatalogComponent } from './components/art-catalog/art-catalog.component';
import { ContactComponent } from './components/contact/contact.component';
import { TodoComponent } from './components/todo/todo.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent, 
    ArtCatalogComponent, 
    ContactComponent, 
    TodoComponent,
    CartDrawerComponent, 
    AuthModalComponent, 
    FooterComponent
  ],
  template: `
    <a href="#main-content" class="skip-link btn btn-dark">Skip to main content</a>
    
    <app-header [activeView]="activeView()" (navigate)="onNavigate($event)" />
    
    <main id="main-content" tabIndex="-1" class="min-vh-100">
      @if (activeView() === 'catalog') {
        <app-art-catalog />
      } @else if (activeView() === 'todo') {
        <app-todo />
      } @else {
        <app-contact />
      }
    </main>

    <app-cart-drawer />
    <app-auth-modal />
    <app-footer />
  `
})
export class AppComponent {
  activeView = signal<'catalog' | 'contact' | 'todo'>('catalog');

  onNavigate(view: 'catalog' | 'contact' | 'todo') {
    this.activeView.set(view);
  }
}