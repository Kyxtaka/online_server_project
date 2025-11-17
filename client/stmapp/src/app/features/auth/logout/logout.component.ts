import { Component, OnInit, inject } from '@angular/core';
import { AppRoutes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
    selector: 'app-logout',
    imports: [],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
  private authService = inject(AuthService);
  logoutRedirection: string = AppRoutes.LOGIN;

  ngOnInit(): void {
    this.authService.logout();
  }
}
