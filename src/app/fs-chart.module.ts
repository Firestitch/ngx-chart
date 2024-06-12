import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  FsChartBarComponent, FsChartColumnComponent,
  FsChartComponent, FsChartLineComponent,
} from './components';


@NgModule({
  imports: [
  ],
  declarations: [
    FsChartComponent,
    FsChartBarComponent,
    FsChartColumnComponent,
    FsChartLineComponent,
  ],
  exports: [
    FsChartComponent,
    FsChartColumnComponent,
    FsChartBarComponent,
    FsChartLineComponent,
  ],
})
export class FsChartModule {
  public static forRoot(): ModuleWithProviders<FsChartModule> {
    return {
      ngModule: FsChartModule,
    };
  }
}
