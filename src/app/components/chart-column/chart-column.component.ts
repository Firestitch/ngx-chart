import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { ColumnChartOptions } from '../../interfaces';
import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
  selector: 'fs-chart-column',
  template: '',
  styleUrls: ['./chart-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChartColumnComponent extends FsChartComponent {

  public type: ChartType = ChartType.ColumnChart;

  @Input()
  declare public options: ColumnChartOptions;

}
