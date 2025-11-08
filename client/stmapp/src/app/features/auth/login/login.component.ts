import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiAuthAService } from '../../../core/services/api/api.service';
import { AppRoutes } from '../../../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiAuthS = inject(ApiAuthAService);

  loginForm = this.fb.group({
    identifier: [''],
    password: [''],
  });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([AppRoutes.HOME]);
    }
  }

  onSubmit() {
    // console.log(this.loginForm.value)
    const { identifier, password } = this.loginForm.value as {
      identifier: string;
      password: string;
    };
    // console.log(`Submit form data get:` , identifier, password)
    if (identifier && password) {
      this.authService.login(identifier, password).subscribe((success) => {
        // console.log("success", success)
        success
          ? this.router.navigate([AppRoutes.HOME])
          : alert('Incerect credentials');
      });
    }
  }
}
