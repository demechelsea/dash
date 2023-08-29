import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SpecificDay } from 'src/app/views/models/specificDay';
import { JobHistoryDTO } from 'src/app/views/models/jobHistoryDTO';
import { DatePipe } from '@angular/common';
import { SpecificJob } from 'src/app/views/models/specificJob';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { JobBatchDetailedDTO } from 'src/app/views/models/jobBatchDetailedDTO';
import { HttpErrorResponse } from '@angular/common/http';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-unusualBarChart',
  templateUrl: './unusualJobs.component.html',
  styleUrls: ['./unusualJobs.component.scss'],
})
export class UnusualChartComponents implements OnChanges,OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() selectedDate: string;

  jobData: JobHistoryDTO[];
  specificJobData: JobHistoryDTO[];
  averageJobData: any;
  jobDataWithNulls: (JobHistoryDTO | null)[] = [];
  private subscriptions = new Subscription();

  selectedSpecificJob: any;

  selectedDayString: string | null;
  formattedDate: string | null;
  selectedDay: SpecificDay;
  topHistoryData: JobHistoryDTO;

  averageJobElapsedTime: string[] = [];
  jobHistoryList: string[] = [];
  jobNames: number[] = [];
  monthlyTopJobsData: JobBatchDetailedDTO[] = [];



  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      this.formattedDate = changes['selectedDate'].currentValue;
      if (this.formattedDate) {
        this.selectedDayString = moment(this.formattedDate, 'YYYYMMDD').format('YYYY-MM-DD');
        this.onApply();
      }

    }

  }
  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {

    this.chartOptions = {
      series: [
        {
          name: 'Average elapsed time',
          data: [],
        },
        {
          name: 'Selected day elapsed time',
          data: [],
          color: '#FF4560',
        },
      ],
      chart: {
        events: {
          dataPointSelection: (event, chartContext, { dataPointIndex }) => {
            const specificJob: SpecificJob = {
              jobId: this.jobData[dataPointIndex].jobId.toString(),
              batchId: this.jobData[dataPointIndex].batchId.toString(),
            };
            this.selectedSpecificJob = specificJob;
            this.cdr.detectChanges();
          },
        },

        type: 'bar',
        height: 500,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 4,
        colors: ['transparent'],
      },
      xaxis: {
        categories: this.jobNames,
        title: {
          text: 'Job names',
        },
        labels: {
          show: true,
        },
        tickAmount: this.jobNames.length,
      },
      yaxis: {
        title: {
          text: 'Elapsed time',
        },
        labels: {
          formatter: function (value) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = Math.floor(value % 60);
            return `${hours}h ${minutes}m ${seconds}s`;
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#008FFB', '#FF4560'],
      },
      tooltip: {
        x: {
          formatter: (val: any) => {
            return val ? this.jobNames[val].toString() : '';
          }
        },
        y: {
          formatter: function (val: any, opts: any) {
            const hours = Math.floor(val / 3600);
            const minutes = Math.floor((val % 3600) / 60);
            const seconds = Math.floor(val % 60);
            return `${hours}h ${minutes}m ${seconds}s`;
          },
        },
      },
    };
  }
  ngOnInit(): void {
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

  onDayChange(event: any) {
    this.selectedDayString = event.target.value;
    this.formattedDate = this.datePipe.transform(
      this.selectedDayString,
      'yyyyMMdd'
    );
  }

  onApply() {
    if (this.formattedDate) {
      const specificDay: SpecificDay = { date: this.formattedDate };
      this.subscriptions.add(this.dashboardService
        .getTopJobHistoryWithAverageJobTime(specificDay)
        .subscribe((data) => {
          this.jobData = data.jobHistoryList;
          this.averageJobElapsedTime = data.averageJobElapsedTime;

          if (this.jobData && this.jobData.length > 0) {
            this.selectedSpecificJob = { jobId: this.jobData[0].jobId, batchId: this.jobData[0].batchId };
          }

          this.jobHistoryList = data.jobHistoryList.map(
            (job: { elapsedTime: any }) => job.elapsedTime
          );

          this.jobNames = data.jobHistoryList.map(
            (job: { jobName: any }) => job.jobName
          );

          const averageData = this.averageJobElapsedTime.map(
            this.timeToSeconds
          );

          const currentData = this.jobHistoryList.map(this.timeToSeconds);

          const xAxisCategories = Array.from(
            { length: this.jobNames.length + 1},
            (_, i) => i + 1
          );

          if (
            this.chartOptions &&
            this.chartOptions.series &&
            this.chartOptions.xaxis
          ) {

            this.chartOptions = {
              ...this.chartOptions,
              series: [
                {
                  name: 'Average elapsed time',
                  data: averageData,
                },
                {
                  name: 'Selected date elapsed time',
                  data: currentData,
                  color: '#FF4560',
                },
              ],
              xaxis: {
                ...this.chartOptions.xaxis,
                categories: xAxisCategories,
                tickAmount: xAxisCategories.length,
              },
            };
            this.cdr.detectChanges();
          } else {
            console.error('chartOptions is undefined');
          }
        }));
    } else {
      console.error('formattedDate is null');
    }
  }

  timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
