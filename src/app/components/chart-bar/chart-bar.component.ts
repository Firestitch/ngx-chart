import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
  selector: 'fs-chart-bar',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChartBarComponent extends FsChartComponent {

  public type: ChartType = ChartType.Bar;

  @Input()
  public options: google.visualization.BarChartOptions;

}
