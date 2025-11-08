import { Injectable, inject } from '@angular/core';
import { Observable, of, map, BehaviorSubject } from 'rxjs';
import { ApiComputerService } from '../api/api.service';
import { ComputerDTO } from '../../../models/dto/computerDTO';

@Injectable({
  providedIn: 'root',
})
export class ComputerService {
  private apiComputerService = inject(ApiComputerService);

  public computerDataSubject: BehaviorSubject<ComputerDTO[] | null>;
  public computerData$: Observable<ComputerDTO[] | null>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.computerDataSubject = new BehaviorSubject<ComputerDTO[] | null>(null);
    this.computerData$ = this.computerDataSubject.asObservable();
  }

  updateComputerData(data: ComputerDTO[]): void {
    this.computerDataSubject.next(data);
  }

  getComputerData(): ComputerDTO[] | null {
    return this.computerDataSubject.value;
  }

  emptyComputerData(): void {
    this.computerDataSubject.next(null);
  }

  logout(): void {
    this.emptyComputerData();
  }

  retrieveComputerData(): void {
    this.apiComputerService.getComputersInfos().subscribe({
      next: (response) => {
        const data = response;
        this.updateComputerData(data);
        return this.getComputerData();
      },
      error: (err) => {
        console.log('error while retriving computer data', err);
        return null;
      },
    });
  }
}
