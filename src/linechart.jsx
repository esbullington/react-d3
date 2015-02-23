'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;
var EventEmitter = require('events').EventEmitter;
var pubsub = exports.pubsub = new EventEmitter();
var utils = require('./utils');

var Line = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      strokeWidth: 1.5,
      fill: 'none',
      className: 'rd3-linechart-path'
    };
  },

  getInitialState: function() {
    // state for animation usage
    return {
      lineStrokeWidth: this.props.strokeWidth,
      lineStroke: this.props.stroke
    };
  },


  componentDidMount: function() {
    pubsub.on('animate', this._animateLine);
    pubsub.on('restore', this._restoreLine);
  },

  componentWillUnmount: function() {
    pubsub.removeListener('animate', this._animateLine);
    pubsub.removeListener('restore', this._restoreLine);
  },

  _animateLine: function(id) {
    if (this.props.id === id.split('-')[0]) {
      this.setState({ 
        lineStrokeWidth: this.state.lineStrokeWidth * 1.8
      });
    }
  },

  _restoreLine: function(id) {
    if (this.props.id === id.split('-')[0]) {
      this.setState({ 
        lineStrokeWidth: this.props.strokeWidth
      });
    }
  },

  render: function() {
    var props = this.props;
    var state = this.state;
    return (
      <path
        d={props.path}
        stroke={state.lineStroke}
        strokeWidth={state.lineStrokeWidth}
        fill={props.fill}
        className={props.className}
      />
    );
  }

});

var Circle = React.createClass({

  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4',
      className: 'rd3-linechart-circle'
    };
  },

  getInitialState: function() {
    // state for animation usage
    return {
      circleRadius: this.props.r,
      circleColor: this.props.fill
    };
  },

  componentDidMount: function() {
    pubsub.on('animateCircle', this._animateCircle);
    pubsub.on('restoreCircle', this._restoreCircle);
  },

  componentWillUnmount: function() {
    pubsub.removeListener('animateCircle', this._animateCircle);
    pubsub.removeListener('restoreCircle', this._restoreCircle);
  },

  render: function() {
    var props = this.props;
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={this.state.circleRadius}
        fill={this.state.circleColor}
        id={props.id}
        className={props.className}
      />
    );
  },
  
  _animateCircle: function(id) {
    if (this.props.id === id) {
      this.setState({ 
        circleRadius: this.state.circleRadius * ( 5 / 4 )
      });
    }
  },

  _restoreCircle: function(id) {
    if (this.props.id === id) {
      this.setState({ 
        circleRadius: this.props.r
      });
    }
  }

});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolationType: 'linear',
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      displayDataPoints: true
    };
  },

  _isDate: function(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render: function() {

    var props = this.props;

    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;

    // Create array of paths, which we'll map over
    // to generate SVG lines
    var interpolatePath = d3.svg.line()
        .y(function(d) {
          return props.yScale(props.yAccessor(d));
        })
        .interpolate(props.interpolationType);

    // Check whether or not an arbitrary data element
    // is a date object (at index 0 here)
    // If it's a date, then we set the x scale a bit differently
    if (this._isDate(props.data[0], xAccessor)) {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d).getTime());
        });
    } else {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d));
        });
    }

    var circles = null;

    if (props.displayDataPoints) {
      // Map over data to generate SVG circles at data points
      // if datum is a date object, treat it a bit differently
      circles = props.data.map(function(point, i) {
        var cx, cy;
        if (this._isDate(point, xAccessor)) {
          cx = props.xScale(xAccessor(point).getTime());
        } else {
          cx = props.xScale(xAccessor(point));
        }
        if (this._isDate(point, yAccessor)) {
          cy = props.yScale(yAccessor(point).getTime());
        } else {
          cy = props.yScale(yAccessor(point));
        }
        return (
          <Circle
            cx={cx}
            cy={cy}
            r={props.pointRadius}
            fill={props.fill}
            key={props.seriesName + i}
            id={props.seriesName + '-' + i}
          />
        );
      }, this);
    }

    return (
      <g>
        <Line
          path={interpolatePath(props.data)}
          stroke={props.fill}
          id={props.seriesName}
        />
        {circles}
      </g>
    );
  }

});


var Axes = React.createClass({

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    xHideOrigin: React.PropTypes.bool,
    yAxisClassName: React.PropTypes.string.isRequired,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    yHideOrigin: React.PropTypes.bool,
    chartHeight: React.PropTypes.number.isRequired,
    chartWidth: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    yAxisLabel: React.PropTypes.string,
    xAxisLabel: React.PropTypes.string,
    yAxisLabelOffset: React.PropTypes.number,
    xAxisLabelOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      axesColor: '#000',
      yAxisLabel: '',
      xAxisLabel: '',
      yAxisLabelOffset: 30,
      xAxisLabelOffset: 35
    };
  },

  render: function() {

    var props = this.props;

    return (
        <g>
          <YAxis
            yAxisClassName={props.yAxisClassName}
            yScale={props.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
            label={props.yAxisLabel}
            labelOffset={props.yAxisLabelOffset}
          />
          <XAxis
            xAxisClassName={props.xAxisClassName}
            xScale={props.xScale}
            xAxisTickCount={props.xAxisTickCount}
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
            label={props.xAxisLabel}
            labelOffset={props.xAxisLabelOffset}
          />
        </g>
    );
  }

});


var LineChart = exports.LineChart = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    legendOffset: React.PropTypes.number,
    pointRadius: React.PropTypes.number,
    yHideOrigin: React.PropTypes.bool,
    xHideOrigin: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func,
    legend: React.PropTypes.bool,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
    xAxisLabel: React.PropTypes.string,
    yAxisLabel: React.PropTypes.string,
    yAxisLabelOffset: React.PropTypes.number,
    xAxisLabelOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 40},
      legendOffset: 120,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: true
      xAxisLabel: '',
      yAxisLabel: '',
      yAxisLabelOffset: 30,
      xAxisLabelOffset: 30
    };
  },

  render: function() {

    var props = this.props;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = props.width - props.margins.left - props.margins.right;
    chartHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      chartWidth = chartWidth - props.legendOffset;
    }

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    pubsub.setMaxListeners(xValues.length + yValues.length);

    var scales = utils.calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

    var dataSeriesArray = props.data.map( (series, idx) => {
      return (
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            seriesName={series.name}
            data={series.values}
            width={chartWidth}
            height={chartHeight}
            fill={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={series.name}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            interpolationType={interpolationType}
            displayDataPoints={props.displayDataPoints}
          />
      );
    });

    return (
      <Chart
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className='rd3-linechart'>
          {dataSeriesArray}
          <Voronoi
            pubsub={pubsub}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={chartWidth}
            height={chartHeight}
          />
          <Axes
            yAxisClassName='rd3-linechart-axis y axis'
            yAxisTickCount={props.yAxisTickCount}
            yScale={scales.yScale}
            yHideOrigin={props.yHideOrigin}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}

            xAxisClassName='rd3-linechart-axis x axis'
            xAxisTickCount={props.xAxisTickCount}
            xScale={scales.xScale}
            xHideOrigin={props.xHideOrigin}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}

            strokeWidth="1"
            margins={props.margins}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
