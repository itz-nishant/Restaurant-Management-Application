import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { MenuItems } from '../model/menu-item.model';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: MenuItems[] = [];
  isPaymentProcessing!: boolean;

  constructor(private mainService: MainService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchCartItems();
  }
  payNow() {
    const totalAmount = this.calculateTotalPrice() * 100; // Convert total amount to smallest currency unit (e.g., paise)

    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: totalAmount,
      name: 'Restaurant-Management',
      key: 'rzp_test_c8OlIJK3ph6TYJ',
      image: 'https://i.imgur.com/FApqk3D.jpeg',
      prefill: {
        email: 'restaurant@gmail.com',
        phone: '9898989898'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed')
        }
      }
    };

    const successCallback = (paymentid: any) => {
      console.log(paymentid);
      this.isPaymentProcessing = false;
    };

    const failureCallback = (e: any) => {
      console.log(e);
      this.isPaymentProcessing = false;
    };

    this.isPaymentProcessing = true;

    Razorpay.open(RozarpayOptions, successCallback, failureCallback);
  }

  calculateTotalPrice(): number {
    let total = 0;
    for (const cartItem of this.cartItems) {
      total += parseFloat(cartItem.strPrice);
    }
    return total;
  }

  fetchCartItems() {
    // Fetch cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    } else {
      // Fetch from API if not stored locally
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId !== null) {
        this.mainService.getCartItems(currentUserId).subscribe(
          (data: MenuItems[]) => {
            this.cartItems = data;
            localStorage.setItem('cartItems', JSON.stringify(data)); // Store cart items
          },
          (error: any) => {
            console.error('Error fetching cart items:', error);
          }
        );
      } else {
        console.error('User not logged in.');
      }
    }
  }

  deleteCartItem(item: MenuItems) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.updateCartDataInLocalStorage();
      this.mainService.deleteCartItem(item).subscribe({
        next: () => {
          console.log('Item deleted successfully from server.');
        },  
        error: (error: any) => {
          console.error('Error deleting item from server:', error);
        }
      });
    }
  }


  // deleteCartItem(item: MenuItems) {
  //   const index = this.cartItems.indexOf(item);
  //   if (index !== -1) {
  //     this.cartItems.splice(index, 1);
  //     this.mainService.deleteCartItem(item).subscribe({
  //       next: () => {
  //         this.updateCartDataInLocalStorage();
  //         console.log('Item deleted successfully from server.');
  //       },
  //       error: (error: any) => {
  //         console.error('Error deleting item from server:', error);
  //       }
  //     });
  //   }
  // }


  updateCartDataInLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

}
