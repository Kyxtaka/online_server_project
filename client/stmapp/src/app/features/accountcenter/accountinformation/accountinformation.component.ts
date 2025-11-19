import { Component, signal, Signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserDTO } from '../../../models/dto/userDTO';
import { UserService } from '../../../core/services/user/user.service';
import { faPen, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgComponentOutlet } from '@angular/common';
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
  public isEditingUsername: WritableSignal<boolean> = signal(false);
  public isEditingEmail: WritableSignal<boolean> = signal(false);
  public infoMessage: WritableSignal<string> = signal('');
  public infoMessageType: WritableSignal<'info' | 'error' | 'success'> = signal('info');

  // Icons
  public faPen = faPen;
  public faCircleInfo = faCircleInfo;
  public faTriangleExclamation = faTriangleExclamation;

  constructor() {}


  // TODO : Edit logic + backend integration and ux improvements
  changeEditingState(mouseEvent: MouseEvent): void {
    console.log('changeEditingState called');
    const targetButton = mouseEvent.currentTarget as HTMLButtonElement;
    const field = targetButton.getAttribute('data-field');
    // console.log('target button:', targetButton);
    // console.log('field to edit:', field);
    // console.log('current states - username:', this.isEditingUsername(), 'email:', this.isEditingEmail());
    if (field === 'username') {
      this.isEditingUsername.update((current) => !current);
    } else if (field === 'email') {
      this.isEditingEmail.update((current) => !current);
    }

  }

}
