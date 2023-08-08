import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordions',
  templateUrl: './EmployeeTable.component.html',
  styleUrls: ['./EmployeeTable.component.scss']
})
export class EmployeeTableComponent {

  items = [1, 2, 3, 4];

  constructor(
    private sanitizer: DomSanitizer
  ) { }
 
}
