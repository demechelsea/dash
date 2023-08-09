import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

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
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  selectedWeek: WeeklyDTO;
  dailyHistoryData: DailyHistoryDTO[];

  ngOnInit() {
    this.selectedWeek = { startDate: '20230731', endDate: '20230806' };
    this.onApply();
  }

  constructor(private dashboardService: DashboardService) {
    const today = moment();
    const startOfWeek = today.startOf('week').add(1, 'days');
    const dates = Array.from({ length: 7 }, (_, i) =>
      moment(startOfWeek).add(i, 'days').toISOString()
    );

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: 'Elapsed Time',
          type: 'column',
          data: [108940, 18180, 14904, 24126, 8172, 14868, 7236],
        },
      ],
      chart: {
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
              const seconds = value % 60;
              return `${hours}h ${minutes}m ${seconds}s`;
            },
          },
        },
      ],
    };
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
    this.selectedWeek = { startDate, endDate };
  }

  onApply() {
    const week = moment(this.selectedWeek.startDate);
    const startDate = week.startOf('week').format('YYYYMMDD');
    const endDate = week.endOf('week').format('YYYYMMDD');
    this.selectedWeek.startDate = startDate;
    this.selectedWeek.endDate = endDate;
    this.dashboardService
      .getDailyHistory(this.selectedWeek).subscribe((data) => {
        console.log('response: ', data);
        this.dailyHistoryData = data;
        this.updateChart();
      });
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
    console.log('chartOptions.series 1:', this.chartOptions.series);

    this.chartOptions.series = [
      {
        name: 'Elapsed Time',
        type: 'column',
        data:Object.values(days),
      },
    ];
    this.chart?.updateSeries(this.chartOptions.series);
    console.log('chartOptions.series 2:', this.chartOptions.series);
  }
}
