import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { AppRoutes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);

  logoutRedirection: string = AppRoutes.LOGIN;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.authService.logout();
  }
}
