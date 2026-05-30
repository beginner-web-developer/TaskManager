import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { Admin } from '../../interfaces/admin';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  message?: string;
  isAdmin: boolean;
  constructor(private formBuilder: FormBuilder, private service: AuthService, 
    private router: Router, private route: ActivatedRoute,private cdr: ChangeDetectorRef) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isAdmin = this.route.snapshot.data['isAdmin'];
  }

  onSubmit(): void {
    if (this.isAdmin) {
      const data: Admin = this.loginForm.value;
      this.service.loginAdmin(data).subscribe({
        next: (response) => {
          this.service.userId.next(response.data);
          this.router.navigate(["/admin/dashboard"]);
          this.loginForm.reset();
        },
        error: (err) => {
          this.message = err.error.message;
          this.cdr.detectChanges();
        }
      });
    } else {
      const data: User = this.loginForm.value;
      this.service.login(data).subscribe({
        next: (response) => {
          this.service.userId.next(response.data);
          this.router.navigate(["/tasks"]);
          this.loginForm.reset();
        },
        error: (err) => {
          this.message = err.error.message;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
