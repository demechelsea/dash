import { Component, ViewChild } from '@angular/core';
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
  templateUrl: './unusualBar.component.html',
  styleUrls: ['./unusualBar.component.scss'],
})
export class UnusualChartComponents {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Average',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: 'Current',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
          color: '#FF4560',
        },
      ],
      chart: {
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
        width:4,
        colors:['transparent']
      },
      xaxis:{
        categories:[
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct'
        ]
      },
      yaxis:{
        title:{
          text:'$ (thousands)'
        }
      },
      fill:{
        opacity :1,
        colors:['#008FFB', '#FF4560']
      },
      tooltip:{
        y:{
          formatter:function(val){
            return '$ '+val+' thousands'
          }
        }
      }
    };
}
}
