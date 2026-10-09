import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  user: any = null;

  records: any[] = [];

  isLoading = false;

  newUser = {
    userId: '',
    name: '',
    password: '',
    role: 'General User'
  };

  adminMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    const storedUser =
      localStorage.getItem('loggedInUser');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  ngOnInit() {

    if (!this.user) {
      this.router.navigate(['/']);
      return;
    }

    this.loadUsers();
  }

  loadUsers() {

    this.isLoading = true;

    this.cdr.detectChanges();

    this.userService.getUsers(
      this.user.userId,
      this.user.role,
      2000
    ).subscribe({

      next: (response: any) => {

        console.log(
          'Users API Response:',
          response
        );

        this.records = response.records;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.log(
          'Users API Error:',
          error
        );

        this.records = [];

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

  addUser() {

    this.adminMessage = '';

    if (
      !this.newUser.userId ||
      !this.newUser.name ||
      !this.newUser.password ||
      !this.newUser.role
    ) {

      this.adminMessage =
        'Please fill all fields';

      this.cdr.detectChanges();

      return;
    }

    this.userService
      .addUser(this.newUser)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Add User Response:',
            response
          );

          this.adminMessage =
            response.message;

          this.newUser = {
            userId: '',
            name: '',
            password: '',
            role: 'General User'
          };

          this.cdr.detectChanges();

          this.loadUsers();
        },

        error: (error: any) => {

          console.log(
            'Add User Error:',
            error
          );

          this.adminMessage =
            error.error?.message ||
            'Failed to create user';

          this.cdr.detectChanges();
        }

      });
  }

  deleteUser(userId: string) {

    const confirmed = confirm(
      `Are you sure you want to delete ${userId}?`
    );

    if (!confirmed) {
      return;
    }

    this.userService
      .deleteUser(userId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Delete Response:',
            response
          );

          this.adminMessage =
            response.message;

          this.cdr.detectChanges();

          this.loadUsers();
        },

        error: (error: any) => {

          console.log(
            'Delete Error:',
            error
          );

          this.adminMessage =
            error.error?.message ||
            'Failed to delete user';

          this.cdr.detectChanges();
        }

      });
  }

  logout() {

    localStorage.removeItem(
      'loggedInUser'
    );

    this.router.navigate(['/']);
  }
}