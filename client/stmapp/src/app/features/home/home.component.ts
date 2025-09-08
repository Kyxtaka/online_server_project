import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/dto/userDTO';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  public data: UserDTO | null = null;
  public isLoading = true;

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.retriveUserInfos();
    this.userService.userData$.subscribe( {
      next: () => {
        this.data = this.userService.getUserData();
        this.isLoading = false;
        console.log(`id: ${this.data?.id}, email: ${this.data?.email}, username: ${this.data?.username}, role: ${this.data?.role}`);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
