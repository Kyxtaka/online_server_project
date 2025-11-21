import { Injectable, OnInit, effect, inject, signal, WritableSignal  } from '@angular/core';
// import { Observable, BehaviorSubject } from 'rxjs';
import { ApiComputerService, ApiWolService } from '../api/api.service';
import { ComputerDTO } from '../../../models/dto/computerDTO';

@Injectable({
  providedIn: 'root',
})
export class ComputerService {
  public computerDataSignal: WritableSignal<ComputerDTO[] | null> = signal<ComputerDTO[] | null>(null);
  public signalLoopPingStatus = signal<boolean>(false);

  // injections
  private apiComputerService = inject(ApiComputerService);
  private apiWolService = inject(ApiWolService);

  constructor() {}

  updateComputerData(data: ComputerDTO[]): void {
    this.computerDataSignal.set(data);
  }

  getComputerData(): ComputerDTO[] | null {
    // console.log('Getting computer data:', this.computerDataSignal());
    return this.computerDataSignal();
  }

  emptyComputerData(): void {
    this.computerDataSignal.set(null);
  }

  logout(): void {
    this.emptyComputerData();
  }

  activateLoopPingStatus(): void {
    this.signalLoopPingStatus.set(true);
  }

  deactivateLoopPingStatus(): void {
    this.signalLoopPingStatus.set(false);
  }

  refreshCumputerStatus(): void {
    const computerData = this.getComputerData();
    if (computerData === null) {
      return;
    }
    for (const computer of computerData) {
      this.apiWolService.pingStatusComputer(computer.macAddress).subscribe({
        next: (response) => {
          if (response.status) {
            console.log(`Computer ${computer.macAddress} is online.`);
            if (computer.status === 'OFFLINE') {
              this.computerDataSignal.update((computers) => {
                if (computers) {
                  const targetComputer = computers.find((c) => c.macAddress === computer.macAddress);
                  if (targetComputer) {
                    targetComputer.status = 'ONLINE';
                  }
                }
                return computers; // Retournez la valeur modifiée
              });
            }
          }
        },
        error: (error) => {
          console.error(`Error pinging computer ${computer.macAddress}:`, error);
          if (computer.status === 'ONLINE') {
            this.computerDataSignal.update((computers) => {
              if (computers) {
                const targetComputer = computers.find((c) => c.macAddress === computer.macAddress);
                if (targetComputer) {
                  targetComputer.status = 'OFFLINE';
                }
              }
              return computers; // Retournez la valeur modifiée
            });
          }
        }
      });
    }
  }

  retrieveComputerData(): void {
    console.log('Initializing looping status');

    this.apiComputerService.getComputersInfos().subscribe({
      next: (response) => {
        const data = response;
        this.updateComputerData(data);
        // this.activateLoopPingStatus();
        console.log('Computer data retrieved and updated:', data);
        // console.log('starting ping status loop.', this.signalLoopPingStatus());
        this.refreshCumputerStatus();
        return this.getComputerData();
      }
    });
  }

  // private readonly loopPingEffect = effect((): void => {
  //   if (this.signalLoopPingStatus()) {
  //     setTimeout(() => {
  //       this.refreshCumputerStatus();
  //       console.log('Refreshed computer statuses via ping.');
  //     }, 60000); // 60 seconds
  //   }
  // });
}
