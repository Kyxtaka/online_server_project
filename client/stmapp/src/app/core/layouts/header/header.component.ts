import { CommonModule } from '@angular/common';
import { Component, inject, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faUser, faHouse, faAddressBook, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from '../../../models/dto/userDTO';
import { AppRoutes } from '../../../app.routes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, FaIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  // private library = inject(FaIconComponent);

  // Icons
  public faRightFromBracket = faRightFromBracket;
  public faUser = faUser;
  public faHouse = faHouse;
  public faScrewdriverWrench = faScrewdriverWrench;
  public faAddressBook = faAddressBook;

  // routes
  public appRoutes = AppRoutes;

  public isLogged: boolean = false;
  // public username: Observable<string> | null;
  public currentUser: WritableSignal<UserDTO | null> = this.userService.userData;

  constructor() {
    this.userService.retriveUserInfos();
    this.isLogged = this.authService.isLoggedIn();
  }


  logout() {
    this.authService.logout();
  }
}
