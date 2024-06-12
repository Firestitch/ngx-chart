import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';


import { fromEvent, Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { getPackageForChart } from '../../helpers';
import { BarChartOptions, ColumnChartOptions, LineChartOptions } from '../../interfaces';
import { DataTableService, ScriptLoaderService } from '../../services';
import { ChartType } from '../../types/chart-type';
import {
  ChartErrorEvent,
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartReadyEvent,
  ChartSelectionChangedEvent,
} from '../../types/events';
import { Formatter } from '../../types/formatter';
import { ChartBase, Column, Row } from '../chart-base';


@Component({
  selector: 'fs-chart',
  template: '',
  styles: [':host { width: fit-content; display: block; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsChartComponent implements ChartBase, OnInit, OnChanges, OnDestroy {

  /**
   * The type of the chart to create.
   */
  @Input()
  public type: ChartType = ChartType.Bar;

  /**
   * Data used to initialize the table.
   *
   * This must also contain all roles that are set in the `columns` property.
   */
  @Input()
  public data!: Row[];

  /**
   * The columns the `data` consists of.
   * The length of this array must match the length of each row in the `data` object.
   *
   * If {@link https://developers.google.com/chart/interactive/docs/roles roles} should be applied, they must be included in this array as well.
   */
  @Input()
  public columns?: Column[];

  /**
   * A convenience property used to set the title of the chart.
   *
   * This can also be set using `options.title`, which, if existant, will overwrite this value.
   */
  @Input()
  public title?: string;

  /**
   * A convenience property used to set the width of the chart in pixels.
   *
   * This can also be set using `options.width`, which, if existant, will overwrite this value.
   */
  @Input()
  public width?: number;

  /**
   * A convenience property used to set the height of the chart in pixels.
   *
   * This can also be set using `options.height`, which, if existant, will overwrite this value.
   */
  @Input()
  public height?: number;

  /**
   * The chart-specific options. All options listen in the Google Charts documentation applying
   * to the chart type specified can be used here.
   */
  @Input()
  public options: BarChartOptions | ColumnChartOptions | LineChartOptions = {};

  /**
   * Used to change the displayed value of the specified column in all rows.
   *
   * Each array element must consist of an instance of a [`formatter`](https://developers.google.com/chart/interactive/docs/reference#formatters)
   * and the index of the column you want the formatter to get applied to.
   */
  @Input()
  public formatters?: Formatter[];

  /**
   * If this is set to `true`, the chart will be redrawn if the browser window is resized.
   * Defaults to `false` and should only be used when specifying the width or height of the chart
   * in percent.
   *
   * Note that this can impact performance.
   */
  @Input()
  public dynamicResize = false;

  @Output()
  public ready = new EventEmitter<ChartReadyEvent>();

  @Output()
  public error = new EventEmitter<ChartErrorEvent>();

  @Output()
  public select = new EventEmitter<ChartSelectionChangedEvent>();

  @Output()
  public mouseover = new EventEmitter<ChartMouseOverEvent>();

  @Output()
  public mouseleave = new EventEmitter<ChartMouseLeaveEvent>();

  private _resizeSubscription?: Subscription;
  private _dataTable: google.visualization.DataTable | undefined;
  private _wrapper: google.visualization.ChartWrapper | undefined;
  private _wrapperReadySubject = new ReplaySubject<google.visualization.ChartWrapper>(1);
  private _initialized = false;
  private _eventListeners = new Map<any, { eventName: string; callback: () => any; handle: any }>();

  constructor(
    private _element: ElementRef,
    private _scriptLoaderService: ScriptLoaderService,
    private _dataTableService: DataTableService,
  ) {}

  public get chart(): google.visualization.ChartBase | null {
    return this.chartWrapper.getChart();
  }

  public get wrapperReady$(): Observable<google.visualization.ChartWrapper> {
    return this._wrapperReadySubject.asObservable();
  }

  public get chartWrapper(): google.visualization.ChartWrapper {
    if (!this._wrapper) {
      throw new Error('Trying to access the chart wrapper before it was fully initialized');
    }

    return this._wrapper;
  }

  public set chartWrapper(wrapper: google.visualization.ChartWrapper) {
    this._wrapper = wrapper;
    this._drawChart();
  }

  public ngOnInit() {
    // We don't need to load any chart packages, the chart wrapper will handle this for us
    this._scriptLoaderService.loadChartPackages(getPackageForChart(this.type))
      .subscribe(() => {
        this._dataTable = this._dataTableService.create(this.data, this.columns, this.formatters);

        // Only ever create the wrapper once to allow animations to happen when something changes.
        this._wrapper = new google.visualization.ChartWrapper({
          container: this._element.nativeElement,
          chartType: this.type,
          dataTable: this._dataTable,
          options: this._mergeOptions(),
        });

        if(this._wrapper.getOption('width')) {
          if(String(this._wrapper.getOption('width')).match(/%/)) {
            this.dynamicResize = true;
            this._updateResizeListener();
          }
        }

        this._registerChartEvents();

        this._wrapperReadySubject.next(this._wrapper);
        this._initialized = true;

        this._drawChart();
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.dynamicResize) {
      this._updateResizeListener();
    }

    if (this._initialized) {
      let shouldRedraw = false;
      if (changes.data || changes.columns || changes.formatters) {
        this._dataTable = this._dataTableService.create(this.data, this.columns, this.formatters);
        this._wrapper.setDataTable(this._dataTable);
        shouldRedraw = true;
      }

      if (changes.type) {
        this._wrapper.setChartType(this.type);
        shouldRedraw = true;
      }

      if (changes.options || changes.width || changes.height || changes.title) {
        this._wrapper.setOptions(this._mergeOptions());
        shouldRedraw = true;
      }

      if (shouldRedraw) {
        this._drawChart();
      }
    }
  }

  public ngOnDestroy(): void {
    this._unsubscribeToResizeIfSubscribed();
  }

  /**
   * For listening to events other than the most common ones (available via Output properties).
   *
   * Can be called after the chart emits that it's "ready".
   *
   * Returns a handle that can be used for `removeEventListener`.
   */
  public addEventListener(eventName: string, callback: () => void): any {
    const handle = this._registerChartEvent(this.chart, eventName, callback);
    this._eventListeners.set(handle, { eventName, callback, handle });

    return handle;
  }

  public removeEventListener(handle: any): void {
    const entry = this._eventListeners.get(handle);
    if (entry) {
      google.visualization.events.removeListener(entry.handle);
      this._eventListeners.delete(handle);
    }
  }

  private _updateResizeListener() {
    this._unsubscribeToResizeIfSubscribed();

    if (this.dynamicResize) {
      this._resizeSubscription = fromEvent(window, 'resize', { passive: true })
        .pipe(debounceTime(100))
        .subscribe(() => {
          if (this._initialized) {
            this._drawChart();
          }
        });
    }
  }

  private _unsubscribeToResizeIfSubscribed() {
    if (this._resizeSubscription) {
      this._resizeSubscription.unsubscribe();
      this._resizeSubscription = undefined;
    }
  }

  private _mergeOptions(): object {
    return {
      title: this.title,
      width: this.width,
      height: this.height,
      ...this.options,
    };
  }

  private _registerChartEvents() {
    google.visualization.events.removeAllListeners(this._wrapper);

    this._registerChartEvent(this._wrapper, 'ready', () => {
      // This could also be done by checking if we already subscribed to the events
      google.visualization.events.removeAllListeners(this.chart);
      this._registerChartEvent(this.chart, 'onmouseover', (event: ChartMouseOverEvent) => this.mouseover.emit(event));
      this._registerChartEvent(this.chart, 'onmouseout', (event: ChartMouseLeaveEvent) => this.mouseleave.emit(event));
      this._registerChartEvent(this.chart, 'select', () => {
        const selection = this.chart.getSelection();
        this.select.emit({ selection });
      });
      this._eventListeners.forEach((x) => (x.handle = this._registerChartEvent(this.chart, x.eventName, x.callback)));

      this.ready.emit({ chart: this.chart });
    });

    this._registerChartEvent(this._wrapper, 'error', (error: ChartErrorEvent) => this.error.emit(error));
  }

  private _registerChartEvent(object: any, eventName: string, callback: (value: any) => any): any {
    return google.visualization.events.addListener(object, eventName, callback);
  }

  private _drawChart() {
    this._wrapper.draw();
  }
}
