import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsChartLineComponent } from '../../../../src/app/components/chart-line/chart-line.component';


@Component({
    selector: 'app-chart-line',
    templateUrl: './chart-line.component.html',
    styleUrls: ['./chart-line.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsChartLineComponent],
})
export class ChartLineComponent {

  public data = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  public columns = ['City', 'Inhabitants'];
  
  public options: google.visualization.LineChartOptions = {
    width: 500,
  };
}
