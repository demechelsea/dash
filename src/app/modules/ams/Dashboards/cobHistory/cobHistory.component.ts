import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-cobHistory',
  templateUrl: './cobHistory.component.html',
  styleUrls: ['./cobHistory.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class COBHistoryComponent {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  
}
