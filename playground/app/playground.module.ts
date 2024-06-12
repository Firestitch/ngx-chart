import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { Observable, of } from 'rxjs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FsChartModule } from 'src/app/fs-chart.module';
import { GOOGLE_CHARTS_LAZY_CONFIG, GoogleChartsConfig } from 'src/app/types/google-charts-config';

import { AppComponent } from './app.component';
import {
  ChartColumnComponent,
  ChartLineComponent,
  ExamplesComponent,
} from './components';
import { ChartBarComponent } from './components/chart-bar';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsChartModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ChartBarComponent,
    ChartColumnComponent,
    ChartLineComponent,
  ],
  providers: [
    {
      provide: GOOGLE_CHARTS_LAZY_CONFIG, 
      useFactory: (): Observable<GoogleChartsConfig> => {
        return of({
          mapsApiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY',
        });
      },
    },
  ],
})
export class PlaygroundModule {
}
