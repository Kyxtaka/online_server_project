import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
}

export interface TableAction<T> {
  label: string;
  color?: string;
  action: (row: T) => void;
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] | null = [];
  @Input() actions: TableAction<T>[] = [];

  @Output() actionClicked = new EventEmitter<{ action: string; row: T }>();

  onAction(action: TableAction<T>, row: T) {
    this.actionClicked.emit({ action: action.label, row });
    action.action(row);
  }
}
