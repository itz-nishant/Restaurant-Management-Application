import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItems } from '../model/menu-item.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>('http://localhost:3000/users');
  }

  addItemToCart(menuItem: MenuItems, userId: number | null): Observable<any> {
    if (userId !== null) {
      const cartItem = { ...menuItem, userId: userId };
      return this.http.post('http://localhost:3000/cart', cartItem).pipe(
        catchError((error) => {
          console.error('Error adding item to cart:', error);
          return throwError('Error adding item to cart');
        })
      );
    } else {
      return throwError('User not logged in');
    }
  }

  getCartItems(userId: number): Observable<MenuItems[]> {
    const url = `http://localhost:3000/cart?userId=${userId}`;
    return this.http.get<MenuItems[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching cart items:', error);
        return throwError('Error fetching cart items');
      })
    );
  }

  deleteCartItem(item: MenuItems) {
    const url = `http://localhost:3000/cart/${item.id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error deleting item:', error);
        return throwError('Error deleting item');
      })
    );
  }

  getMenuItems(): Observable<MenuItems[]> {
    const url = 'http://localhost:3000/menu';
    return this.http.get<MenuItems[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching menu items:', error);
        return throwError('Error fetching menu items');
      })
    );
  }

  getGuestUserId(): number {
    return 1;
  }

  addGuestItemToCart(menuItem: MenuItems): Observable<any> {
    const guestUserId = this.getGuestUserId();
    return this.addItemToCart(menuItem, guestUserId);
  }
}
