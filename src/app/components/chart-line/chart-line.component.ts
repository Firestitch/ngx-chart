import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { LineChartOptions } from '../../interfaces';
import { ChartType } from '../../types/chart-type';
import { FsChartComponent } from '../chart';


@Component({
    selector: 'fs-chart-line',
    template: '',
    styleUrls: ['./chart-line.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsChartLineComponent extends FsChartComponent {

  public type: ChartType = ChartType.Line;

  @Input()
  declare public options: LineChartOptions;

}
