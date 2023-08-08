import {
  ChangeDetectorRef,
  Component,
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
  selector: 'dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('lineChartContainer', { read: ViewContainerRef })
  lineChartContainer: ViewContainerRef;
  public chartOptions: Partial<ChartOptions>;

  showLineCharts = false;

  constructor(private cdr: ChangeDetectorRef) {
    const today = moment();
    const startOfWeek = today.startOf('week');
    const dates = Array.from({ length: 7 }, (_, i) =>
      moment(startOfWeek).add(i, 'days').toISOString()
    );

    this.chartOptions = {
      series: [
        {
          name: 'Elapsed Time',
          type: 'column',
          data: [15840, 18180, 14904, 24126, 8172, 14868, 7236],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          dataPointSelection: (event, chartContext, config) => {
            this.showLineChart();
          },
        },
      },
      stroke: {
        width: [0, 7],
      },
      title: {
        text: 'Weekly elapsed time',
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: dates,
      xaxis: {
        tickPlacement: 'between',
        tickAmount: 7,
        labels: {
          formatter: function (value, timestamp) {
            if (timestamp === undefined) {
              return '';
            }
            const days = [
              'Sunday',
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

  showLineChart() {
    this.showLineCharts = true;
    this.cdr.detectChanges();
  }
}
