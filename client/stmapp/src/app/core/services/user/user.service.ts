import { Injectable, inject, signal } from '@angular/core';
import { ApiUserService } from '../api/api.service';
// import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../../../models/dto/userDTO';
import { ComputerService } from '../computer/computer.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiUserService);
  private computerService = inject(ComputerService);

  public userData = signal<UserDTO | null>(null);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor() {}

  public getUserData(): UserDTO | null {
    return this.userData();
  }

  public updateUserData(data: UserDTO | null): void {
    this.userData.set(data);
  }

  public emptyUserData(): void {
    this.userData.set(null);
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
