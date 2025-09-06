import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.loginForm.value)
  }
}
