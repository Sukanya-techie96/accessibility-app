import { Injectable, signal, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { User, AuthMode } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private announcer = inject(LiveAnnouncer);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthModalOpen = signal<boolean>(false);
  readonly activeMode = signal<AuthMode>('login');

  openModal(mode: AuthMode = 'login') {
    this.activeMode.set(mode);
    this.isAuthModalOpen.set(true);
    this.announcer.announce(`Opened ${mode === 'login' ? 'Sign In' : 'Sign Up'} dialog window.`, 'assertive');
  }

  closeModal() {
    this.isAuthModalOpen.set(false);
    this.announcer.announce('Authentication dialog closed.', 'polite');
  }

  setMode(mode: AuthMode) {
    this.activeMode.set(mode);
    this.announcer.announce(`Switched to ${mode === 'login' ? 'Sign In' : 'Sign Up'} form.`, 'polite');
  }

  login(email: string, fullName = 'User') {
    const user: User = { id: 'usr-1', fullName, email };
    this.currentUser.set(user);
    this.closeModal();
    this.announcer.announce(`Successfully signed in as ${fullName}.`, 'assertive');
  }

  signup(fullName: string, email: string) {
    this.login(email, fullName);
  }

  logout() {
    const name = this.currentUser()?.fullName || 'User';
    this.currentUser.set(null);
    this.announcer.announce(`${name} signed out successfully.`, 'polite');
  }
}