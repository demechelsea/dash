import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Subscription } from 'rxjs';
import { JobBatchDetailedDTO } from "../../../../views/models/jobBatchDetailedDTO";
import { SpecificJob } from 'src/app/views/models/specificJob';

@Component({
  selector: 'topJobs-table',
  templateUrl: './monthlyJobHisory.component.html',
  styleUrls: ['./monthlyJobHisory.component.scss'],
})
export class MonthlyJobHistoryComponent implements OnDestroy {

  private subscriptions = new Subscription();
  selectedSpecificJob: any;

  monthlyTopJobsData: JobBatchDetailedDTO[] = [];
  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    this.getTopJobs();

  }

  getTopJobs(): void {
    this.dashboardService.getTopJobsForlatestMonth().subscribe(
      (response: any) => {
        this.monthlyTopJobsData = response;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  ShowJobHistory(jobId: number, batchId: number){
    const specificJob: SpecificJob = {
      jobId: jobId.toString(),
      batchId: batchId.toString()
    };
    this.selectedSpecificJob = specificJob;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
