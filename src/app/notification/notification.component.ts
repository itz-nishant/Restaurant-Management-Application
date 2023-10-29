import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service'; 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];

  constructor(private mainService:MainService) {}

  ngOnInit() {
    // this.fetchNotifications();
  }

  // fetchNotifications() {
  //   this.mainService.getNotifications().subscribe(
  //     (data: any[]) => {
  //       this.notifications = data;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   );
  // }
}
