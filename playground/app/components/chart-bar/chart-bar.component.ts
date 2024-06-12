import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BarChartOptions } from '@firestitch/chart';


@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartBarComponent {

  public data = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  public columns = ['City', 'Inhabitants'];
  
  public options: BarChartOptions = {
    height: 400,
    width: '100%',
  };
}
