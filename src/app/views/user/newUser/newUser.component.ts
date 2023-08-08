import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordions',
  templateUrl: './newUser.component.html',
  styleUrls: ['./newUser.component.scss']
})
export class NewUserComponent {
  
  constructor(
    private sanitizer: DomSanitizer
  ) { }
 
}
