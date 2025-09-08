import { Injectable } from '@angular/core';
import { ApiUserService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiUserService) { }
}
