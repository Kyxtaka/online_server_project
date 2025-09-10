import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  public isLogged: boolean = false;
  public username: Observable<string> | null;
  
  constructor(private authService: AuthService, private userService: UserService) {
    this.userService.retriveUserInfos();
    this.username = this.userService.userData$.pipe(
      map( user => user?.username ? user.username : "none")
    );
    this.isLogged = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
      
  }

}
