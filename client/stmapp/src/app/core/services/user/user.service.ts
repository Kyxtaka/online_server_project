import { Injectable } from '@angular/core';
import { ApiUserService } from '../api/api.service';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { UserDTO } from '../../../models/dto/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userDataSubject: BehaviorSubject<UserDTO | null>;
  public userData$: Observable<UserDTO | null>

  constructor(private apiService: ApiUserService) {
    this.userDataSubject = new BehaviorSubject<UserDTO | null>(null);
    this.userData$ = this.userDataSubject.asObservable();

   }

  public getUserData(): UserDTO | null {
    return this.userDataSubject.getValue();
  
  }

  // public getUserData2(): Observable<UserDTO> {
  //   if (this.userDataSubject.getValue() != null) {
  //     return new 
  //   }
  // }
 
  public updateUserData(data: UserDTO | null): void {
    this.userDataSubject.next(data);
  }

  public emptyUserData():void  {
    this.userDataSubject.next(null);
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
