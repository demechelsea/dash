import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SpecificDay } from 'src/app/views/models/specificDay';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;

};

@Component({
  selector: 'app-line',
  templateUrl: './stageLineGraph.component.html',
  styleUrls: ['./stageLineGraph.component.scss'],
})
export class StageLineGraphComponent {
  @Input() stageDate: any;
  chartData: any;
  averageChartData: any;

  public cumulativeElapsedTimeInSeconds: number[] = [];


  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  public stageNames: string[] = [];
  private subscriptions = new Subscription();

  constructor(private cdr: ChangeDetectorRef, private dashboardService: DashboardService) {
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
          formatter: (value: any, index: number) => index === 0 ? '' : this.stageNames[index - 1],
        },
      },
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      
      dataLabels: {
        enabled: true,
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

  ngOnChanges(changes: SimpleChanges) {  
    const stageDateChange = changes['stageDate'];
    if (stageDateChange?.currentValue) {
      this.stageDate = stageDateChange.currentValue;
      this.getDailyStageHistory(this.stageDate);
    }
  }
  
  getDailyStageHistory(stageDate: any) {
    const specificDate: SpecificDay = { date: stageDate };
    this.subscriptions.add(
      this.dashboardService
        .getDailyStageHistory(specificDate)
        .subscribe((data) => {
          this.updateChartData(data);
        })
    );
  }
  

  updateChartData(data: any) {
    this.chartData = data.stageHistoryList;
    this.averageChartData = data.averageStageElapsedTime;
    this.stageNames = this.chartData.map((item: any) => item.stage.name);

    if (this.averageChartData) {
      const averageElapsedTimeInSeconds = this.getElapsedTimeInSeconds(this.averageChartData);
      const cumulativeAverageElapsedTimeInSeconds = this.getCumulativeTime(averageElapsedTimeInSeconds);

      const elapsedTimeInSeconds = this.getElapsedTimeInSeconds(this.chartData.map((list: any) => list.elapsedTime));
      const cumulativeElapsedTimeInSeconds = this.getCumulativeTime(elapsedTimeInSeconds);

      if (Array.isArray(cumulativeAverageElapsedTimeInSeconds) && Array.isArray(cumulativeElapsedTimeInSeconds)) {
        this.cumulativeElapsedTimeInSeconds = cumulativeElapsedTimeInSeconds;
        this.updateChartOptions(cumulativeAverageElapsedTimeInSeconds);
      }
    }
  }

  getElapsedTimeInSeconds(timeValues: string[]) {
    return timeValues.map((timeString) => this.convertToSeconds(timeString));
  }

  getCumulativeTime(timeValues: number[]) {
    return timeValues.reduce((acc: number[], cur: number, idx: number) => {
      const prev = idx > 0 ? acc[idx - 1] : 0;
      return [...acc, cur + prev];
    }, []);
  }


  updateChartOptions(cumulativeAverageElapsedTimeInSeconds: number[]) {
    const seriesData = [
      [0, 0],
      ...this.cumulativeElapsedTimeInSeconds.map((value: number, index: number) => [value, index + 1])
    ];

    const averageSeriesData = [
      [0, 0],
      ...cumulativeAverageElapsedTimeInSeconds.map((value: number, index: number) => [value, index + 1])
    ];

    const xAxisCategories = Array.from(
      { length: this.stageNames.length},
      (_, i) => i + 1
    );

    console.log(xAxisCategories);
    

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        { name: 'Time', type: 'line', data: seriesData },
        { name: 'Average Time', type: 'line', data: averageSeriesData }
      ],
      yaxis: {
        ...this.chartOptions.yaxis,
        labels: {
          minWidth: 50,
          formatter: (value: number, index: number) => index === 0 ? '' : this.stageNames[index - 1]
        }
      },
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: xAxisCategories,
        tickAmount: xAxisCategories.length,
      },
      
    };
    this.cdr.detectChanges();
  }


  convertToSeconds(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
