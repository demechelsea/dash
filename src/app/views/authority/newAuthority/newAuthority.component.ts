import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-accordions',
  templateUrl: './newAuthority.component.html',
  styleUrls: ['./newAuthority.component.scss']
})
export class NewAuthorityComponent {

  items = [1, 2, 3, 4];
  
  constructor(
    private sanitizer: DomSanitizer
  ) { }
 
}
