import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-accordions',
  templateUrl: './authorityTable.component.html',
  styleUrls: ['./authorityTable.component.scss']
})
export class AuthorityTableComponent {

  constructor(
    private sanitizer: DomSanitizer
  ) { }
 
}

