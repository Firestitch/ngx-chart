import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { BarChartOptions } from '../../interfaces';
import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
  selector: 'fs-chart-bar',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./chart-bar.component.scss'],
})
export class FsChartBarComponent extends FsChartComponent {

  public type: ChartType = ChartType.Bar;

  @Input()
  declare public options: BarChartOptions;

}
