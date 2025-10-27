import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { ChartBarComponent } from '../chart-bar/chart-bar.component';
import { ChartColumnComponent } from '../chart-column/chart-column.component';
import { ChartLineComponent } from '../chart-line/chart-line.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, ChartBarComponent, ChartColumnComponent, ChartLineComponent]
})
export class ExamplesComponent {
  public config = environment;
}
