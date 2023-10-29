import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  userName: string = '';
  showNotifications: boolean = false;
  cartItemsCount: number = 0;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.email === 'guest@example.com') {
      this.userName = 'Guest';
    } else if (user) {
      this.userName = user.firstName;
    } else {
      this.userName = 'Unknown';
    }

    this.items = [
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/cart',
        command: () => {
          this.toggleNotifications();
        },
        badge: this.cartItemsCount > 0 ? this.cartItemsCount.toString() : null
      },
      {
        label: this.userName,
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          }
        ]
      },
    ];

    // this.mainService.getCartItemsCount().subscribe((count: number) => {
    //   this.cartItemsCount = count;
    //   this.updateCartBadge();
    // });

    this.updateCartItemsCount();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  updateCartItemsCount() {
    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId !== null && currentUserId !== undefined) {
      this.mainService.getCartItems(currentUserId).subscribe(
        (cartItems) => {
          this.cartItemsCount = cartItems.length;
          this.updateCartBadge();
        },
        (error: any) => {
          console.error('Error fetching cart items:', error);
        }
      );
    } else {
      // Reset cart items count to 0 if the user is not logged in or is a guest
      this.cartItemsCount = 0;
      this.updateCartBadge();
    }
  }

  updateCartBadge() {
    const cartItem = this.items.find((item) => item.label === 'Cart') as MenuItem | undefined;
    if (cartItem) {
      cartItem.badge = this.cartItemsCount > 0 ? this.cartItemsCount.toString() : undefined;
    }
  }
}
