import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})

export class SignUp {
  signUpForm: FormGroup;
  message?: string;
  user?: User;
  constructor(private formBuilder: FormBuilder, private service: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    const data: User = this.signUpForm.value;
    this.service.register(data).subscribe({
      next: (response) => {
        this.user = response.data;
        this.router.navigate(["/login"]);
        this.signUpForm.reset();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }
}
