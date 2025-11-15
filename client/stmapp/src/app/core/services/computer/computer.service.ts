import { Injectable, inject, signal } from '@angular/core';
// import { Observable, BehaviorSubject } from 'rxjs';
import { ApiComputerService } from '../api/api.service';
import { ComputerDTO } from '../../../models/dto/computerDTO';

@Injectable({
  providedIn: 'root',
})
export class ComputerService {
  private apiComputerService = inject(ApiComputerService);
  public computerDataSignal = signal<ComputerDTO[] | null>(null);

  constructor() {}

  updateComputerData(data: ComputerDTO[]): void {
    this.computerDataSignal.set(data);
  }

  getComputerData(): ComputerDTO[] | null {
    return this.computerDataSignal();
  }

  emptyComputerData(): void {
    this.computerDataSignal.set(null);
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
      }
    });
  }
}
