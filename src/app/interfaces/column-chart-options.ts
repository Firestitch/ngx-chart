import { ChartOptions } from './chart-options';

export 
  interface ColumnChartOptions 
  extends Omit<google.visualization.BarChartOptions, 'width'>, ChartOptions {}
