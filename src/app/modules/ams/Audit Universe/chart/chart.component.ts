import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-line',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponents implements OnInit {
  @Input() data: any;
  public cumulativeElapsedTimeInSeconds: number[] = [];

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  public stageNames: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [],
      xaxis: {
        type: 'numeric',
        title: {
          text: 'Elapsed Time',
        },
        labels: {
          formatter: function (value: any) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value % 3600) / 60);
            const seconds = Math.floor(value % 60);
            return `${hours}h ${minutes}m ${seconds}s`;
          },
        },
      },
      yaxis: {
        title: {
          text: 'Stages',
        },
        labels: {
          minWidth: 50,
          formatter: (value: any, index: number) => {
            if (index === 0) return '';
            return this.stageNames[index - 1];
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const newData = changes['data'].currentValue;
      if (newData) {
        this.stageNames = newData.map((item: any) => item.stage.name);
        if (this.chartOptions.xaxis) {
          this.chartOptions.xaxis.tickAmount = this.stageNames.length;
        } 
        this.chart?.updateOptions(this.chartOptions);
        const elapsedTimeValues = newData.map((list: any) => list.elapsedTime);
        const elapsedTimeInSeconds = elapsedTimeValues.map((time: string) => {
          const [hours, minutes, seconds] = time.split(':').map(Number);
          return hours * 3600 + minutes * 60 + seconds;
        });

        this.cumulativeElapsedTimeInSeconds = elapsedTimeInSeconds.reduce(
          (acc: number[], cur: number) => [
            ...acc,
            cur + (acc.length > 0 ? acc[acc.length - 1] : 0),
          ],
          []
        );
        this.chartOptions.series = [
          {
            name: 'Time',
            type: 'line',
            data: [
              [0, 0],
              ...this.cumulativeElapsedTimeInSeconds.map((value, index) => [
                value,
                index + 1,
              ]),
            ],
          },
        ];
        this.chart?.updateSeries(this.chartOptions.series);
        this.cdr.detectChanges();
      }
    }
  }
}
