import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiAuthAService } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group(
    {
      identifier: [''],
      password: ['']
    }
  )

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private apiAuthS: ApiAuthAService) {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['home']);
    }
  }

  onSubmit() {
    // console.log(this.loginForm.value)
    const { identifier, password } = this.loginForm.value as { identifier: string; password: string };
    // console.log(`Submit form data get:` , identifier, password)
    if (identifier && password) {
      this.authService.login(identifier, password).subscribe( success => { 
        // console.log("success", success)
        success ? this.router.navigate(['/home']): alert("Incerect credentials");
      });
    }
  }
}
