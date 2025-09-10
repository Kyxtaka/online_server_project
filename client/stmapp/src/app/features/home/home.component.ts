import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/dto/userDTO';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { TableColumn, DashboardComponent } from '../../shared/dashboard/dashboard.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  public isLoading = true;

  public userData$: Observable<UserDTO[] | null>;

  constructor(private userService: UserService) {
    this.userService.retriveUserInfos();
    this.userData$ = this.userService.userData$.pipe(
      map(user => user != null ? [user] : [])
    );
  }

  userColumns: TableColumn<UserDTO>[] = [
    { key: 'id', header: 'ID' },
    { key: 'email', header: 'Email' },
    { key: 'username', header: 'Username' },
    { key: 'role', header: 'Role' }
  ];

  ngOnInit(): void {
    console.log(this.userData$)
  }
}
