import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';

import { WeeklyDTO } from 'src/app/views/models/weekly report';
import { DailyHistoryDTO } from 'src/app/views/models/dailyHistory';
import { COBHistoryDTO } from 'src/app/views/models/COBHistory';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SpecificDay } from 'src/app/views/models/specificDay';
import { Subscription } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any;
  dataLabels: any;
  fill: ApexFill;
  tooltip: ApexTooltip;
};
@Component({
  selector: 'app-dash',
  templateUrl: './weeklyElpasedTime.component.html',
  styleUrls: ['./weeklyElpasedTime.component.scss'],
})
export class WeeklyElpasedTimeComponent implements OnInit {
  chartData: any;
  averageChartData: any;
  chartDataWithNulls: (DailyHistoryDTO | null)[] = [];

  private subscriptions = new Subscription();

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  selectedWeek: WeeklyDTO;
  dailyHistoryData: DailyHistoryDTO[];
  COBHistory: COBHistoryDTO[];
  selectedWeekString: string;

  ngOnInit() {
    this.subscriptions.add(
      this.dashboardService.getCOBHistory().subscribe((data) => {
        this.COBHistory = data;
      })
    );
    const today = moment();
    const startOfLastWeek = today
      .subtract(1, 'weeks')
      .startOf('week')
      .add(1, 'days');
    const endOfLastWeek = moment(startOfLastWeek).add(6, 'days');
    const startDate = startOfLastWeek.format('YYYYMMDD');
    const endDate = endOfLastWeek.format('YYYYMMDD');
    this.selectedWeek = { startDate, endDate };
    this.subscriptions.add(
      this.dashboardService
        .getDailyHistory(this.selectedWeek)
        .subscribe((data) => {
          this.dailyHistoryData = data;
          this.updateChart();
        })
    );
    const lastMonday = startOfLastWeek.format('YYYYMMDD');
    const specificDay: SpecificDay = { date: lastMonday };
    this.subscriptions.add(
      this.dashboardService
        .getDailyStageHistory(specificDay)
        .subscribe((data) => {
          this.chartData = data.stageHistoryList;
          this.averageChartData = data.averageStageElapsedTime;                    
          this.cdr.detectChanges();
        })
    );
  }

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    const today = moment();
    const startOfWeek = today.startOf('week').add(1, 'days');
    const dates = Array.from({ length: 7 }, (_, i) =>
      moment(startOfWeek).add(i, 'days').toISOString()
    );

    this.chartOptions = {
      ...this.chartOptions,
      series: [],
      chart: {
        events: {
          dataPointSelection: (event, chartContext, { dataPointIndex }) => {
            const data = this.chartDataWithNulls[dataPointIndex];            
            if (data) {
              const selectedUtcDate = data.utcDate;
              const specificDay: SpecificDay = { date: selectedUtcDate };
              this.subscriptions.add(
                this.dashboardService
                  .getDailyStageHistory(specificDay)
                  .subscribe((data) => {
                    this.chartData = data.stageHistoryList;
                    this.averageChartData = data.averageStageElapsedTime;                    
                    this.cdr.detectChanges();
                  })
              );
            } else {
              console.log('No data for this day');
            }
          },
        },
        height: 350,
        type: 'bar',
      },
      stroke: {
        width: [0, 7],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      tooltip: {
        theme: 'dark',
        enabled: true,
        y: {
          formatter: function (value) {
            return value.toString();
          },
        },
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const data = this.dailyHistoryData[dataPointIndex];
          if (data) {
            const utcDate = data.utcDate;
            const year = utcDate.substring(0, 4);
            const month = utcDate.substring(4, 6);
            const day = utcDate.substring(6, 8);
            const date = new Date(`${year}-${month}-${day}`);
            const monthNames = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ];
            const formattedDate = `${day} ${
              monthNames[date.getMonth()]
            } ${year}`;
            return `<div style="background-color: #333; color: #fff; padding: 10px; border-radius: 5px;">
                      <div>Uploaded By: ${data.uploadedBy}</div>
                      <div>Start Time: ${data.startTime}</div>
                      <div>End Time: ${data.endTime}</div>
                      <div>Upload Date Time: ${data.uploadDateTime}</div>
                      <div>UTC Date: ${formattedDate}</div>
                    </div>`;
          }
          return '';
        },
      },
      labels: dates,
      xaxis: {
        tickPlacement: 'between',
        tickAmount: 7,
        title: {
          text: 'Day of the week',
        },
        labels: {
          formatter: function (value, timestamp) {
            if (timestamp === undefined) {
              return '';
            }
            const days = [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ];
            const date = new Date(timestamp);
            const dayIndex = date.getUTCDay();
            if (date.toDateString() === new Date().toDateString()) {
              return `${days[dayIndex]}`;
            }
            return days[dayIndex];
          },
        },
      },

      yaxis: [
        {
          title: {
            text: 'Elapsed Time',
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
      ],
    };
  }

  onWeekChange(event: any) {
    this.selectedWeekString = event.target.value;
    const weekString = event.target.value;
    const [year, week] = weekString.split('-W');
    const startDate = moment()
      .year(parseInt(year))
      .week(parseInt(week))
      .startOf('week')
      .format('YYYY-MM-DD');
    const endDate = moment()
      .year(parseInt(year))
      .week(parseInt(week))
      .endOf('week')
      .format('YYYY-MM-DD');
    this.selectedWeek = { startDate, endDate };
  }

  onApply() {
    const week = moment(this.selectedWeek.startDate);
    const startDate = week.startOf('week').add(1, 'days').format('YYYYMMDD');
    const endDate = week.endOf('week').format('YYYYMMDD');
    this.selectedWeek.startDate = startDate;
    this.selectedWeek.endDate = endDate;
    this.subscriptions.add(
      this.dashboardService
        .getDailyHistory(this.selectedWeek)
        .subscribe((data) => {
          this.dailyHistoryData = data;
          this.updateChart();
        })
    );

    const specificDay: SpecificDay = { date: startDate };

    this.subscriptions.add(
      this.dashboardService
        .getDailyStageHistory(specificDay)
        .subscribe((data) => {
          this.chartData = data;
          this.cdr.detectChanges();
        })
    );
  }

  updateChart() {
    const days = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    for (const data of this.dailyHistoryData) {
      const { cobDay, elapsedTime } = data;
      const [hours, minutes, seconds] = elapsedTime.split(':').map(Number);
      const elapsedTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

      days[cobDay as keyof typeof days] = elapsedTimeInSeconds;
    }

    this.chartDataWithNulls = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ].map((day) => {
      return this.dailyHistoryData.find((data) => data.cobDay === day) || null;
    });

    this.chartOptions.series = [
      {
        name: 'Elapsed Time',
        type: 'column',
        data: Object.values(days),
      },
    ];

    this.chart?.updateSeries(this.chartOptions.series);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
