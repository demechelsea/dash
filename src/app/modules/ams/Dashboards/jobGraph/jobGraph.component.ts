import {
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';
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
  selector: 'jobHistory',
  templateUrl: './jobGraph.component.html',
  styleUrls: ['./jobGraph.component.scss'],
})
export class JobMonthlyElpasedTimeComponent implements OnInit {
  @Input() jobData: any;
  @Input() averageJobData: any;

  public cumulativeElapsedTimeInSeconds: number[] = [];

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  public stageNames: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        type: 'category',
        title: {
          text: `Days of a month (${moment().format('MMMM')})`,
        },
        tickAmount: 10,
      },
      yaxis: {
        title: {
          text: 'Elapsed times',
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
    };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobData'] && changes['jobData'].currentValue) {
      this.jobData = changes['jobData'].currentValue;
  
      if (this.jobData && this.jobData.length !== undefined) {
        const xAxisCategories = Array.from(
          { length: this.jobData.length },
          (_, i) => i + 1
        );
  
        this.chartOptions.series = [
          {
            name: 'Job Elapsed Time',
            data: this.jobData.map((job: any, index: number) => {
              return {
                x: index  + 1,
                y: this.convertToSeconds(job.elapsedTime),
              };
            }),
          },
        ];
  
        if (
          this.chartOptions &&
          this.chartOptions.series &&
          this.chartOptions.xaxis
        ) {
          this.chartOptions = {
            ...this.chartOptions,
            xaxis: {
              ...this.chartOptions.xaxis,
              categories: xAxisCategories,
              tickAmount: xAxisCategories.length - 1,
            },
          };
        } else {
          console.error('chartOptions is undefined');
        }
      }
    }
  
    if (changes['averageJobData'] && changes['averageJobData'].currentValue) {
      this.averageJobData = changes['averageJobData'].currentValue;
    }
  
    if (this.jobData && this.jobData.length !== undefined) {
      const averageJobSeries = {
        name: 'Average Job Elapsed Time',
        data: Array(this.jobData.length)
          .fill(null)
          .map((_, index) => {
            return {
              x: index + 1,
              y: this.convertToSeconds(this.averageJobData),
            };
          }),
      };
  
      if (this.chartOptions?.series) {
        this.chartOptions.series.push(averageJobSeries);
      }
    }
  
    if (this.chart && this.chartOptions) {
      this.chart.updateOptions(this.chartOptions);
    }
  
    this.cdr.detectChanges();
  }
   
  convertToSeconds(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}
