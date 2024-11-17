import { Component, Input } from '@angular/core';

@Component({
  standalone: true, // Declare as standalone
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input() title: string = '';
  @Input() value: string | number | null = null;
}

