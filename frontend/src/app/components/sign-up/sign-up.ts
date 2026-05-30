import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/authService';
import { Admin } from '../../interfaces/admin';

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
  isAdmin: boolean;
  constructor(private formBuilder: FormBuilder, private service: AuthService, 
    private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
      this.isAdmin = this.route.snapshot.data['isAdmin'];
      this.signUpForm = this.formBuilder.group({
      email: [{ value: '', disabled: this.isAdmin }, [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      company: [{ value: '', disabled: !this.isAdmin }]
    });
  }

  onSubmit(): void {
    if (this.isAdmin) {
      const data: Admin = this.signUpForm.value;
      this.service.registerAdmin(data).subscribe({
        next: (response) => {
          this.message = response.message;
          this.router.navigate(["/admin/login"]);
          this.signUpForm.reset();
        },
        error: (err) => {
          this.message = err.error.message;
          this.cdr.detectChanges();
        }
      });
    } else {
      const data: User = this.signUpForm.value;
      this.service.register(data).subscribe({
        next: (response) => {
          this.message = response.message;
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
}
