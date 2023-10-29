import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { MainService } from '../services/main.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private mainService: MainService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.mainService.getUsers().subscribe(
        (users: User[]) => {
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            console.log('Login successful:', user);
            this.authService.login(user);
            this.authService.setCurrentUserId(user.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Invalid credentials', user);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });
          }
        },
        (error) => {  
          console.error('Login failed:', error);
        }
      );
    }
  }
  guestLogin(){
    const guestUser: User = { email: 'guest@example.com', password: '', userId: 1 , id:null, firstName: 'guest'};
    this.authService.login(guestUser);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Guest Login successful!' });
    this.router.navigate(['/dashboard']);
  }
}