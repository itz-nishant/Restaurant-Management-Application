import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { MenuItems } from '../model/menu-item.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: MenuItems[] = [];
  cartItems: MenuItems[] = [];

  constructor(private mainService: MainService, private authService: AuthService) {}

  ngOnInit() {
    const storedMenuItems = localStorage.getItem('menuItems');
    if (storedMenuItems) {
      this.menuItems = JSON.parse(storedMenuItems);
    } else {
      this.fetchMenuItems();
    }

    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }
  }

  fetchMenuItems() {
    this.mainService.getMenuItems().subscribe(
      (data) => {
        this.menuItems = data;
        localStorage.setItem('menuItems', JSON.stringify(data));
      },
      (error) => {
        console.error('Error fetching menu items:', error);
      }
    );
  }

  addItemToCart(menuItem: MenuItems) {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId !== null) {
      this.mainService.addItemToCart(menuItem, currentUserId).subscribe(
        () => {
          console.log('Item added to cart successfully.');
          this.cartItems.push(menuItem);
          this.updateCartDataInLocalStorage();
        },
        (error) => {
          console.error('Error adding item to cart:', error);
        }
      );
    } else {
      const guestUserId = this.mainService.getGuestUserId();
      if (guestUserId === null) {
        this.mainService.addGuestItemToCart(menuItem).subscribe(
          () => {
            console.log('Item added to cart for guest user.');
            this.cartItems.push(menuItem);
            this.updateCartDataInLocalStorage();
          },
          (error: any) => {
            console.error('Error adding item to cart for guest user:', error);
          }
        );
      } else {
        console.log('Guest user ID not set.');
      }
    }
  }

  updateCartDataInLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
