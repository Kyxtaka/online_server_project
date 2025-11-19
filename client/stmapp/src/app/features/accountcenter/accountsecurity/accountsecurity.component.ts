import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
    selector: 'app-accountsecurity',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FaIconComponent],
    templateUrl: './accountsecurity.component.html',
    styleUrls: ['./accountsecurity.component.css']
})
export class AccountSecurityComponent {

  private userService: UserService = inject(UserService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  //icons
  public faTriangleExclamation = faTriangleExclamation;

  // form
  public editPasswordForm: FormGroup = this.formBuilder.group({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmNewPassword: new FormControl('', [Validators.required])
  });

  // password wrong value
  public oneEmptyField: WritableSignal<boolean> = signal(false);
  public passwordMismatch: WritableSignal<boolean> = signal(false);

  constructor() {}

  public onSubmit(): void {
    if (this.editPasswordForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword } = this.editPasswordForm.value;
      if (newPassword !== confirmNewPassword) {
        this.passwordMismatch.set(true);
        this.oneEmptyField.set(false);
        return;
      }
      console.log('Password change submitted:', { currentPassword, newPassword });
      // Reset error signals
      this.passwordMismatch.set(false);
      this.oneEmptyField.set(false);
      return;
    }
  }
}
