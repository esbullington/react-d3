'use strict';

var React = require('react');
var d3 = require('d3');
var DataSeries = require('./DataSeries');
var { Chart, XAxis, YAxis } = require('../common');
var { CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin ],

  displayName: 'AreaChart',

  propTypes: {
    margins:           React.PropTypes.object,
    interpolate:       React.PropTypes.bool,
    interpolationType: React.PropTypes.string,
    hoverAnimation:    React.PropTypes.bool,
 },

  getDefaultProps() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      yAxisTickCount: 4,
      interpolate: false,
      interpolationType: null,
      className: 'rd3-areachart',
      hoverAnimation: true
    };
  },

  render() {

    var props = this.props;

    var data = props.data;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    var {innerWidth, innerHeight, trans, svgMargins} = this.getDimensions();
    var yOrient = this.getYOrient();

    if (!Array.isArray(data)) {
      data = [data];
    }

    var yScale = d3.scale.linear()
      .range([innerHeight, 0]);

    var xValues = [];
    var yValues = [];
    var seriesNames = [];
    var yMaxValues = [];
    var domain = props.domain || {};
    var xDomain = domain.x || [];
    var yDomain = domain.y || [];
    data.forEach( (series) => {
      var upper = 0;
      seriesNames.push(series.name);
      series.values.forEach((val, idx) => {
        upper = Math.max(upper, props.yAccessor(val));
        xValues.push(props.xAccessor(val));
        yValues.push(props.yAccessor(val));
      });
      yMaxValues.push(upper);
    });

    var xScale;
    if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]' && props.xAxisTickInterval) {
      xScale = d3.time.scale()
        .range([0, innerWidth]);
    } else {
      xScale = d3.scale.linear()
        .range([0, innerWidth]);
    }

    var xdomain = d3.extent(xValues);
    if(xDomain[0] !== undefined && xDomain[0] !== null) xdomain[0] = xDomain[0];
    if(xDomain[1] !== undefined && xDomain[1] !== null) xdomain[1] = xDomain[1];
    xScale.domain(xdomain);
    var ydomain = [0, d3.sum(yMaxValues)];
    if(yDomain[0] !== undefined && yDomain[0] !== null) ydomain[0] = yDomain[0];
    if(yDomain[1] !== undefined && yDomain[1] !== null) ydomain[1] = yDomain[1];
    yScale.domain(ydomain);

    props.colors.domain(seriesNames);

    var stack = d3.layout.stack()
      .x(props.xAccessor)
      .y(props.yAccessor)
      .values((d)=> { return d.values; });

    var layers = stack(data);

    var dataSeries = layers.map( (d, idx) => {
      return (
          <DataSeries
            key={idx}
            seriesName={d.name}
            fill={props.colors(props.colorAccessor(d, idx))}
            index={idx}
            xScale={xScale}
            yScale={yScale}
            data={d.values}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            interpolationType={interpolationType}
            hoverAnimation={props.hoverAnimation}
          />
        );
      });

    return (
      <Chart
        viewBox={this.getViewBox()}
        legend={props.legend}
        data={data}
        margins={props.margins}
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className={props.className}>
          <XAxis
            xAxisClassName='rd3-areachart-xaxis'
            xScale={xScale}
            xAxisTickValues={props.xAxisTickValues}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisTickCount={props.xAxisTickCount}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            tickFormatting={props.xAxisFormatter}
            xOrient={props.xOrient}
            yOrient={yOrient}
            margins={svgMargins}
            width={innerWidth}
            height={innerHeight}
            horizontalChart={props.horizontal}
            gridVertical={props.gridVertical}
            gridVerticalStroke={props.gridVerticalStroke}
            gridVerticalStrokeWidth={props.gridVerticalStrokeWidth}
            gridVerticalStrokeDash={props.gridVerticalStrokeDash}
          />
          <YAxis
            yAxisClassName='rd3-areachart-yaxis'
            yScale={yScale}
            yAxisTickValues={props.yAxisTickValues}
            yAxisTickInterval={props.yAxisTickInterval}
            yAxisTickCount={props.yAxisTickCount}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            tickFormatting={props.yAxisFormatter}
            xOrient={props.xOrient}
            yOrient={yOrient}
            margins={svgMargins}
            width={innerWidth}
            height={props.height}
            horizontalChart={props.horizontal}
            gridHorizontal={props.gridHorizontal}
            gridHorizontalStroke={props.gridHorizontalStroke}
            gridHorizontalStrokeWidth={props.gridHorizontalStrokeWidth}
            gridHorizontalStrokeDash={props.gridHorizontalStrokeDash}
          />
          {dataSeries}
        </g>
      </Chart>
    );
  }

});
