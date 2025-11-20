import { Component, inject, Signal, signal, WritableSignal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { UserChangePasswordDTO, UserDTO } from '../../../models/dto/userDTO';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiUserService } from '../../../core/services/api/api.service';


@Component({
    selector: 'app-accountsecurity',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FaIconComponent],
    templateUrl: './accountsecurity.component.html',
    styleUrls: ['./accountsecurity.component.css']
})
export class AccountSecurityComponent  {

  private userService: UserService = inject(UserService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private userApiService = inject(ApiUserService);

  //icons
  public faTriangleExclamation = faTriangleExclamation;

  // form
  public editPasswordForm: FormGroup = this.formBuilder.group({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
  });

  // password wrong value
  public oneEmptyField: WritableSignal<boolean> = signal(false);
  public passwordMismatch: WritableSignal<boolean> = signal(false);
  public passwordChanged: WritableSignal<boolean> = signal(false);
  public serverError: WritableSignal<boolean> = signal(false);

  // values
  constructor() {}

  public onSubmit(): void {
    if (this.editPasswordForm.valid) {
      const currentUserData: Signal<UserDTO | null> = this.userService.userData;
      const { currentPassword, newPassword, confirmNewPassword } = this.editPasswordForm.value;
      if (newPassword !== confirmNewPassword) {
        this.passwordMismatch.set(true);
        this.oneEmptyField.set(false);
        return;
      }
      if (currentUserData() === null) {
        console.log('error no user data found, aborting password change');
        this.serverError.set(true);
        return;
      }
      const userChangePasswordDTO: UserChangePasswordDTO = {
        currentPassword,
        newPassword
      }
      console.log('Password change submitted:', userChangePasswordDTO);
      this.userApiService.changePassword(currentUserData()!, userChangePasswordDTO).subscribe({
        next: (response: any) => {
          console.log('Password changed successfully:', response);
          // Optionally reset the form here
          this.editPasswordForm.reset();
          // Reset error signals
          this.passwordMismatch.set(false);
          this.oneEmptyField.set(false);
          this.passwordChanged.set(true);
        },
        error: (error: any) => {
          console.error('Error changing password:', error);
          // Handle error (e.g., show error message to user)
          this.passwordChanged.set(false);
          this.passwordMismatch.set(false);
          this.oneEmptyField.set(false);
          this.serverError.set(true);
        }
      });
      return;
    }
    this.oneEmptyField.set(true);
    this.passwordMismatch.set(false);
    this.passwordChanged.set(false);
    this.serverError.set(false);
    return;
  }

}
