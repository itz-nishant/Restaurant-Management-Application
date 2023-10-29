import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private messageService: MessageService, private router:Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.http.get<any[]>('http://localhost:3000/users').subscribe(
        (users: any[]) => {
          const existingUser = users.find(
            (u) => u.email === userData.email
          );
          if (existingUser) {
            console.log('User already exists:', existingUser);
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'User already exists!' });
          } else {
            this.http.post('http://localhost:3000/users', userData).subscribe(
              (response:any) => {
                console.log('Sign-up successful:', response);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign-up successful!' });
                this.registerForm.reset();
                this.router.navigate(['/login']);
              },
              (error) => {
                console.error('Sign-up failed:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to sign up!' });
              }
            );
          }
        },
        (error) => {
          console.error('Failed to retrieve users:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to retrieve users!' });
        }
      );
    }
  }
}
