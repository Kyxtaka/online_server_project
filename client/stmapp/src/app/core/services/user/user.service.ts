import { Injectable } from '@angular/core';
import { ApiUserService } from '../api/api.service';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { UserDTO } from '../../../models/dto/userDTO';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { appConfig } from '../../../app.config';
import { AppRoutes } from '../../../app.routes';
import { ComputerService } from '../computer/computer.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userDataSubject: BehaviorSubject<UserDTO | null>;
  public userData$: Observable<UserDTO | null>

  constructor(
    private apiService: ApiUserService, 
    // private authService: AuthService, 
    private router: Router, 
    private computerService: ComputerService) {
    this.userDataSubject = new BehaviorSubject<UserDTO | null>(null);
    this.userData$ = this.userDataSubject.asObservable();

   }

  public getUserData(): UserDTO | null {
    return this.userDataSubject.getValue();
  }

  public updateUserData(data: UserDTO | null): void {
    this.userDataSubject.next(data);
  }

  public emptyUserData():void  {
    this.userDataSubject.next(null);
  }

  public logout(): void {
    this.emptyUserData();
    this.computerService.emptyComputerData();
  }

  public retriveUserInfos(): void {
    this.apiService.getUserInfos().subscribe({
      next: (response) => {
        const data: UserDTO = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
          createdAt: response.createdAt
        };
        this.updateUserData(data);
        return this.getUserData();
      },
      error: (err) => {
        console.log("error while retriving user data", err);
        return null
      }
    })
  }
}
