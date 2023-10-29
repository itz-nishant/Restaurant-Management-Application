import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private currentUser: User | null = null;
  private currentUserId: number | null = null;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedIn = true;
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(user: User) {
    this.loggedIn = true;
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.loggedIn = false;
    this.currentUser = null;
    this.currentUserId = null;
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('menuItems');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUserId(userId: number) {
    this.currentUserId = userId;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
}
