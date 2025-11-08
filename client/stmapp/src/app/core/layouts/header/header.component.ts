import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  public isLogged: boolean = false;
  public username: Observable<string> | null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.userService.retriveUserInfos();
    this.username = this.userService.userData$.pipe(
      map((user) => (user?.username ? user.username : 'none')),
    );
    this.isLogged = this.authService.isLoggedIn();
  }

  ngOnInit(): void {}
}
