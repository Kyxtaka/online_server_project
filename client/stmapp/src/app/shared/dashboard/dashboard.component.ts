import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T;       // ex: 'email', 'username'
  header: string;     // titre affiché
}

export interface TableAction<T> {
  label: string;             // Texte du bouton (Edit, Delete…)
  color?: string;            // Optionnel: style (tailwind class)
  action: (row: T) => void;  // Callback exécutée quand on clique
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
    action.action(row); // exécute la callback si définie
  }
}
