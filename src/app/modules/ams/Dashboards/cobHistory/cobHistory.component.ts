import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subscription } from 'rxjs';
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
  private subscription: Subscription;

  constructor(private cobHistoryService: DashboardService) {}

  ngOnInit() {
    this.getCOBHistory();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCOBHistory(): void {
    this.subscription = this.cobHistoryService.getCOBHistory().subscribe(
      (response: COBHistoryDTO) => {
        this.cobHistory = response;
        if (this.cobHistory.initialJTAnalyzed) {
          this.cobHistory.initialJTAnalyzed = this.formatDate(
            this.cobHistory.initialJTAnalyzed
          );
        }
        if (this.cobHistory.latestRecordedJTAnalyzed) {
          this.cobHistory.latestRecordedJTAnalyzed = this.formatDate(
            this.cobHistory.latestRecordedJTAnalyzed
          );
        }
      },
      (error) => {
        console.error('Failed to get COB history:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    if (dateString && dateString.length >= 11) {
      const year = dateString.substring(3, 7);
      const month = dateString.substring(7, 9);
      const day = dateString.substring(9, 11);
      const date = new Date(`${year}-${month}-${day}`);

      return `${date.getDate()} ${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`;
    } else {
      console.error(`Invalid date string: ${dateString}`);
      return dateString;
    }
  }
}
