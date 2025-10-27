import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ColumnChartOptions } from '@firestitch/chart';
import { FsChartColumnComponent } from '../../../../src/app/components/chart-column/chart-column.component';


@Component({
    selector: 'app-chart-column',
    templateUrl: './chart-column.component.html',
    styleUrls: ['./chart-column.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsChartColumnComponent],
})
export class ChartColumnComponent {

  public data = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  public columns = ['City', 'Inhabitants'];
  
  public options: ColumnChartOptions = {
    legend: { position: 'none' },
  };
}
