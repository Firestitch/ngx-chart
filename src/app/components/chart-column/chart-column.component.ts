import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
  selector: 'fs-chart-column',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChartColumnComponent extends FsChartComponent {

  public type: ChartType = ChartType.ColumnChart;

  @Input()
  public options: google.visualization.ColumnChartOptions;

}
