import { Injectable, inject } from '@angular/core';
import { ApiWolService } from '../api/api.service';
import { Observable, map, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WolService {
  private apiWolService = inject(ApiWolService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  wakePC(pcMac: string): Observable<string> {
    return this.apiWolService.wake(pcMac).pipe(
      map((res) => {
        console.log('test msg ans', res.message);
        return res.message;
      }),
      catchError((res) => {
        console.error(
          `Error while waking pc: ${pcMac}, API response msg: ${res.messsage}`,
        );
        return of(`Unabled to wake pc ${pcMac}`);
      }),
    );
  }
}
