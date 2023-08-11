import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  styleUrls: ['./widgets-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsBrandComponent implements AfterContentInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() withCharts?: boolean;
  chartOptions = {
    // elements: {
    //   line: {
    //     tension: 0.4
    //   },
    //   point: {
    //     radius: 0,
    //     hitRadius: 10,
    //     hoverRadius: 4,
    //     hoverBorderWidth: 3
    //   }
    // },
    // maintainAspectRatio: false,
    // plugins: {
    //   legend: {
    //     display: false
    //   }
    // },
    // scales: {
    //   x: {
    //     display: false
    //   },
    //   y: {
    //     display: false
    //   }
    // }
  };
  // labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // datasets = {
  //   borderWidth: 2,
  //   fill: true
  // };
  // colors = {
  //   backgroundColor: 'rgba(255,255,255,.1)',
  //   borderColor: 'rgba(255,255,255,.55)',
  //   pointHoverBackgroundColor: '#fff',
  //   pointBackgroundColor: 'rgba(255,255,255,.55)'
  // };
  brandData = [
    {
      icon: 'cibFacebook',
      values: [{ title: 'friends', value: '89K' }, { title: 'feeds', value: '459' }],
      capBg: { '--cui-card-cap-bg': '#3b5998' },
 
    },
    {
      icon: 'cibTwitter',
      values: [{ title: 'followers', value: '973k' }, { title: 'tweets', value: '1.792' }],
      capBg: { '--cui-card-cap-bg': '#00aced' },
      
    },
    {
      icon: 'cib-linkedin',
      values: [{ title: 'contacts', value: '500' }, { title: 'feeds', value: '1.292' }],
      capBg: { '--cui-card-cap-bg': '#4875b4' },
     
    },
    {
      icon: 'cilCalendar',
      values: [{ title: 'events', value: '12+' }, { title: 'meetings', value: '4' }],
      color: 'warning',
      
    }
  ];

  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
