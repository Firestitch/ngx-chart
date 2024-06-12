import { ChartOptions } from './chart-options';

export 
  interface BarChartOptions 
  extends Omit<google.visualization.BarChartOptions, 'width'>, ChartOptions {}
