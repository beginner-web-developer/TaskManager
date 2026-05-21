import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  message?: string;
  user?: User;
  constructor(private formBuilder: FormBuilder, private service: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const data: User = this.loginForm.value;
    this.service.login(data).subscribe({
      next: (response) => {
        this.user = response.data;
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
