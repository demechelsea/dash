import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { COBHistoryDTO } from 'src/app/views/models/COBHistory';

@Component({
  selector: 'app-cobHistory',
  templateUrl: './cobHistory.component.html',
  styleUrls: ['./cobHistory.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class COBHistoryComponent {
  public cobHistory: COBHistoryDTO;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private cobHistoryService: DashboardService
  ) {}

  ngOnInit() {
    this.getCheckLists();
  }

  getCheckLists(): void {
    this.cobHistoryService.getCOBHistory().subscribe((response: any) => {
      this.cobHistory = response;
      console.log(this.cobHistory);
      
    });
  }
}
