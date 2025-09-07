import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group(
    {
      identifier: [''],
      password: ['']
    }
  )

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  onSubmit() {
    console.log(this.loginForm.value)
      const { identifier, password } = this.loginForm.value as { identifier: string; password: string };

    // const identifier  = this.loginForm.get('identifier');
    // const password = this.loginForm.get('password');
    console.log(`Submit form data get:` , identifier, password)
    if (identifier && password) {
      this.authService.login(identifier, password)
    }
    
  }
}
