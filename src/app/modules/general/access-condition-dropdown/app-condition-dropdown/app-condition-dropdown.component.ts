// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-app-condition-dropdown',
//   templateUrl: './app-condition-dropdown.component.html',
//   styleUrls: ['./app-condition-dropdown.component.scss']
// })
// export class AppConditionDropdownComponent {

// }
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-condition-dropdown',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Condition</mat-label>
      <mat-select [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)">
        <mat-option *ngFor="let condition of conditions" [value]="condition">{{ condition }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class AppConditionDropdownComponent implements OnInit {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  public conditions: string[];

  ngOnInit() {
    this.conditions = ['--Select--', 'Contains', 'In', 'Equals To', 'Starts With', 'Ends With'];
    this.value = '--Select--';
  }
}
