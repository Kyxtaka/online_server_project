import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserDTO } from '../../../models/dto/userDTO';
import {  } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { faPen, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-accountinformation',
    standalone: true,
    imports: [CommonModule, FaIconComponent, FontAwesomeModule],
    templateUrl: './accountinformation.component.html',
    styleUrls: ['./accountinformation.component.css']
})
export class AccountInformationComponent {

  // dependencies injection
  private userService: UserService = inject(UserService);
  // private formBuilder: FormBuilder = inject(FormBuilder);

  // reactive behavior
  public userData: Signal<UserDTO | null> = this.userService.userData;

  // reactive forms
  // public accountInfoForm = this.formBuilder.group({
  //   username: [this.userData()?.username || '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  //   email: [this.userData()?.email || '', [Validators.required, Validators.email]],
  // });

  // Icons
  public faPen = faPen;
  public faCircleInfo = faCircleInfo;

  constructor() {}

  // submitEditInfo() {
  //   if (this.accountInfoForm.valid) {
  //     const { username, email } = this.accountInfoForm.value;
  //     console.log('Submitted info:', { username, email }); // test only
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
}
