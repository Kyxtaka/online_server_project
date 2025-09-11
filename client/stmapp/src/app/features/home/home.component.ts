import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/dto/userDTO';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { TableColumn, DashboardComponent, TableAction } from '../../shared/dashboard/dashboard.component';
import { map, Observable } from 'rxjs';
import { ComputerDTO } from '../../models/dto/computerDTO';
import { ComputerService } from '../../core/services/computer/computer.service';
import { WolService } from '../../core/services/wol/wol.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  public isLoading = true;
  public userData$: Observable<UserDTO[] | null>;
  public computerData$: Observable<ComputerDTO[] | null>;
  constructor(private userService: UserService, private computerService: ComputerService, private wolService: WolService) {
    this.userService.retriveUserInfos();
    this.userData$ = this.userService.userData$.pipe(
      map(user => user != null ? [user] : [])
    );
    this.computerService.retrieveComputerData();
    this.computerData$ = this.computerService.computerData$.pipe(
      map(computers => computers != null ? computers : [])
    )
  }

  public wakePc(pc: ComputerDTO) {
    // ⚠️ Il faut que ton UserDTO contienne l’adresse MAC du PC
    this.wolService.wakePC(pc.macAddress).subscribe(msg => {
      console.log(`WOL result for ${pc.hostname}: ${msg}`);
      alert(msg)
    });
  }

  userColumns: TableColumn<UserDTO>[] = [
    { key: 'id', header: 'ID' },
    { key: 'email', header: 'Email' },
    { key: 'username', header: 'Username' },
    { key: 'role', header: 'Role' }
  ];

  computerColumns: TableColumn<ComputerDTO>[] = [
    { key: 'macAddress', header: 'MAC'},
    { key: 'localV4IpAddress', header: 'local IPv4'},
    { key: 'v6IpAddress', header: 'IPv6'},
    { key: 'name', header: 'Name'},
    { key: 'hostname', header: 'Host'},
    { key: 'os', header: 'OS'},
    { key: 'status', header: 'Status'},
    { key: 'lastseen', header: 'Last Seen'},
  ]

  computerAction: TableAction<ComputerDTO>[] = [
    {label: 'Wake me up', color: 'green', action: (pc) => this.wakePc(pc)}
  ]

  ngOnInit(): void {
    console.log(this.userData$)
  }
}
