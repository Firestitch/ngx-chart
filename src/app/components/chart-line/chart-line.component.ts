import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
  selector: 'fs-chart-line',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChartLineComponent extends FsChartComponent {

  public type: ChartType = ChartType.Line;

  @Input()
  public options: google.visualization.LineChartOptions;

}
