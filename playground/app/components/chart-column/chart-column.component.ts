import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-chart-column',
  templateUrl: './chart-column.component.html',
  styleUrls: ['./chart-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  
  public options: google.visualization.ColumnChartOptions = {
    legend: { position: 'none' },
    height: 400,
  };
}
