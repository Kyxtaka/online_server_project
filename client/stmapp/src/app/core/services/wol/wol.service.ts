import { Injectable } from '@angular/core';
import { ApiWolService } from '../api/api.service';
import { Observable, map, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WolService {

  constructor(private apiWolService: ApiWolService) {}

  wakePC(pcMac: string): Observable<string> {
    return this.apiWolService.wake(pcMac).pipe(
      map(res => {
        console.log('test msg ans', res.msg);
        return res.msg;
      }),
      catchError(
        res => { 
          console.error(`Error while waking pc: ${pcMac}, API response msg: ${res.msg}`);
          return of(`Unabled to wake pc ${pcMac}`)
         }
      )
    );
  }
}
