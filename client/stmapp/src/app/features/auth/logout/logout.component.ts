import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { AppRoutes } from '../../../app.routes';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{

  logoutRedirection: string = AppRoutes.LOGIN

  constructor(private authService: AuthService) {
    
  }


  ngOnInit(): void {
    this.authService.logout();
  }
}
