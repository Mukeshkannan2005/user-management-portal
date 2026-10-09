import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  userId = '';
  password = '';
  role = '';

  message = '';
  isLoading = false;

  constructor(
  private authService: AuthService,
  private cdr: ChangeDetectorRef,
  private router: Router
) {}

  login() {
    this.message = '';
    this.isLoading = true;

    this.authService.login(
      this.userId,
      this.password,
      this.role
    ).subscribe({
      next: (response: any) => {
  this.isLoading = false;
  this.message = response.message;

  console.log('Login Response:', response);
  localStorage.setItem('loggedInUser', JSON.stringify(response.user));

  this.cdr.detectChanges();

  this.router.navigate(['/dashboard']);
},

      error: (error: any) => {
        this.isLoading = false;
        this.message =
          error.error?.message || 'Login failed';

        console.log('Login Error:', error);

        this.cdr.detectChanges();
      }
    });
  }
}