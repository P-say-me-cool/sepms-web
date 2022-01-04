import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import {
  LineChart,GaugeChart,BarChart
} from 'echarts/charts';
import {
  CanvasRenderer
} from 'echarts/renderers';

echarts.use(
  [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart,GaugeChart,BarChart, CanvasRenderer]
);

export default echarts;
