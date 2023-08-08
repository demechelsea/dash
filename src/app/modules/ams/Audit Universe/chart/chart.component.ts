import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
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
  ApexTooltip,
} from 'ng-apexcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { StageDTO } from 'src/app/views/models/stages';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-line',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponents implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  public stageNames: string[] = [];

  ngOnInit(): void {
    this.getDashboards();
    this.updateStageData();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {
    this.chartOptions = {
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: false,
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
      xaxis: {
        title: {
          text: 'Time',
        },
        tickPlacement: 'between',
        labels: {
          formatter: (value: any) => {
            if (value === 0) {
              return '0';
            } else {
              const hours = Math.floor(value / 3600);
              const minutes = Math.floor((value % 3600) / 60);
              const seconds = Math.floor(value % 60);
              return `${hours}h   ${minutes}m   ${seconds}s`;
            }
          },
        },
      },
      yaxis: [
        {
          title: {
            text: 'Stages',
          },
          min: 0,
          forceNiceScale: true,
          labels: {
            formatter: (value) => {
              if (value === 0) {
                return '0';
              } else {
                return this.stageNames[value - 1];
              }
            },
          },
        },
      ],
    };
  }

  updateStageData() {
    const stageTimes = [900, 180, 104, 226, 82];
    const seriesData = [];
    seriesData.push({ x: 0, y: 0 });
    let cumulativeTime = 0;
    for (let i = 0; i < stageTimes.length; i++) {
      cumulativeTime += stageTimes[i];
      seriesData.push({ x: cumulativeTime, y: i + 1 });
    }
    this.chartOptions.series = [
      {
        name: 'Stage',
        data: seriesData,
      },
    ];
    this.chart?.updateOptions(this.chartOptions);
    this.cdr.detectChanges();
  }

  public getDashboards(): void {
    this.dashboardService.getAllStageNames().subscribe(
      (response: StageDTO[]) => {
        this.stageNames = response.map((stage) => stage.name);
        this.updateStageData();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
}
