import { ChartOptions } from './chart-options';

export 
  interface LineChartOptions 
  extends Omit<google.visualization.BarChartOptions, 'width'>, ChartOptions {}
