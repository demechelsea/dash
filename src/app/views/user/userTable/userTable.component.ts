
import { Component } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordions',
  templateUrl: './UserTable.component.html',
  styleUrls: ['./UserTable.component.scss']
})
export class UserTableComponent {

  constructor(private sanitizer: DomSanitizer) { }

  
  
}
