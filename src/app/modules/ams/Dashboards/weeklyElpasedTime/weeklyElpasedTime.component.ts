import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  selectedDateValue: string;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  selectedWeek: WeeklyDTO;
  dailyHistoryData: DailyHistoryDTO[];
  COBHistory: COBHistoryDTO[];
  selectedWeekString: string;

  private readonly DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  ngOnInit() {
    this.initData();
  }

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    this.initChartOptions();
  }

  private initChartOptions() {
    const today = moment();
    const startOfWeek = today.startOf('week').add(1, 'days');
    const dates = Array.from({ length: 6 }, (_, i) =>
      moment(startOfWeek).add(i, 'days').toISOString()
    );

    this.chartOptions = {
      ...this.chartOptions,
      series: [],
      chart: {
        events: {
          dataPointSelection: (event, chartContext, { dataPointIndex }) => {
            const dataPoint = this.chartDataWithNulls[dataPointIndex];
            if (dataPoint !== null) {
              this.handleDataPointSelection(dataPointIndex);
              this.selectedDateValue = dataPoint.utcDate;
            }
          }
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
          return this.customTooltip(dataPointIndex);
        },
      },
      labels: dates,
      xaxis: this.initXAxis(),
      yaxis: [
        {
          title: {
            text: 'Elapsed Time',
          },
          labels: {
            formatter: (value: any) => {
              return this.formatElapsedTime(value);
            },
          },
        },
      ],

    };
  }

  private handleDataPointSelection(dataPointIndex: number) {
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
  }

  private initXAxis() {
    return {
      tickPlacement: 'between',
      tickAmount: 6,
      title: {
        text: 'Days of the week',
      },
      labels: {
        formatter: function (value: any, timestamp: string | number | Date | undefined) {
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
          ];
          const date = new Date(timestamp);
          const dayIndex = date.getUTCDay();
          if (date.toDateString() === new Date().toDateString()) {
            return `${days[dayIndex]}`;
          }
          return days[dayIndex];
        },
      },
    };
  }

  private formatElapsedTime(value: number) {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }



  initData() {
    const today = moment();
    const startOfLastWeek = today
      .subtract(1, 'weeks')
      .startOf('week')
      .add(1, 'days');
    const endOfLastWeek = moment(startOfLastWeek).add(6, 'days');
    const startDate = startOfLastWeek.format('YYYYMMDD');
    const endDate = endOfLastWeek.format('YYYYMMDD');

    this.selectedWeekString = today.format('YYYY-[W]WW');

    this.selectedWeek = { startDate, endDate };

    this.subscriptions.add(
      this.dashboardService.getCOBHistory().subscribe((data) => {
        this.COBHistory = data;
        this.updateDailyHistory();
        this.updateDailyStageHistory(startOfLastWeek);
      })
    );
    this.selectedDateValue = startDate;
  }


  updateDailyHistory() {
    this.subscriptions.add(
      this.dashboardService
        .getDailyHistory(this.selectedWeek)
        .subscribe((data) => {
          this.dailyHistoryData = data;
          this.updateChart();
        })
    );
  }

  updateDailyStageHistory(startOfLastWeek: moment.Moment) {
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

  onWeekChange(event: any) {
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

    this.selectedWeekString = weekString;
    this.selectedWeek = { startDate, endDate };
  }

  onApply() {
    const week = moment(this.selectedWeek.startDate);
    const startDate = week.startOf('week').add(1, 'days').format('YYYYMMDD');
    const endDate = week.endOf('week').format('YYYYMMDD');

    this.selectedWeek.startDate = startDate;
    this.selectedWeek.endDate = endDate;

    this.selectedDateValue = startDate;

    this.updateDailyHistory();
    this.updateSpecificDayData(startDate);
  }

  updateSpecificDayData(date: string) {
    const specificDay: SpecificDay = { date };

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

  private customTooltip(dataPointIndex: number) {
    const data = this.dailyHistoryData.find(
      (item) =>
        moment(item.utcDate, 'YYYYMMDD').day() - 1 === dataPointIndex
    );
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
      const formattedDate = `${day} ${monthNames[date.getMonth()]
        } ${year}`;
      return `<div style="background-color: #333; color: #fff; padding: 10px; border-radius: 5px;">
                <div>Uploaded By: ${data.uploadedBy}</div>
                <div>Elapsed time: ${data.elapsedTime}</div>
                <div>Start Time: ${data.startTime}</div>
                <div>End Time: ${data.endTime}</div>
                <div>Upload Date Time: ${data.uploadDateTime}</div>
                <div>UTC Date: ${formattedDate}</div>
              </div>`;
    }
    return '';
  }

  updateChart() {
    const daysData = this.DAYS.reduce((acc: Record<string, number>, day) => {
      const data = this.dailyHistoryData.find((data) => data.cobDay === day);
      acc[day] = data ? this.timeToSeconds(data.elapsedTime) : 0;
      return acc;
    }, {});

    this.chartDataWithNulls = this.DAYS.map((day) => {
      const dataForDay = this.dailyHistoryData.find((data) => data.cobDay === day);
      return dataForDay || null;
    });


    this.chartOptions.series = [
      {
        name: 'Elapsed Time',
        type: 'column',
        data: Object.values(daysData),
      },
    ];

    this.chart?.updateSeries(this.chartOptions.series);
  }


  timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
