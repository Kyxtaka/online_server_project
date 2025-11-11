import { Injectable, inject } from '@angular/core';
import { ApiUserService } from '../api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../../../models/dto/userDTO';
import { Router } from '@angular/router';
import { ComputerService } from '../computer/computer.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiUserService);
  private router = inject(Router);
  private computerService = inject(ComputerService);

  public userDataSubject: BehaviorSubject<UserDTO | null>;
  public userData$: Observable<UserDTO | null>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor() {
    this.userDataSubject = new BehaviorSubject<UserDTO | null>(null);
    this.userData$ = this.userDataSubject.asObservable();
  }

  public getUserData(): UserDTO | null {
    return this.userDataSubject.getValue();
  }

  public updateUserData(data: UserDTO | null): void {
    this.userDataSubject.next(data);
  }

  public emptyUserData(): void {
    this.userDataSubject.next(null);
  }

  public logout(): void {
    this.emptyUserData();
    this.computerService.emptyComputerData(); //remove local computer data for connected user
  }

  public retriveUserInfos(): void {
    this.apiService.getUserInfos().subscribe({
      next: (response) => {
        const data: UserDTO = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
          createdAt: response.createdAt,
        };
        this.updateUserData(data);
        return this.getUserData();
      },
      error: () => {
        return null;
      },
    });
  }
}
