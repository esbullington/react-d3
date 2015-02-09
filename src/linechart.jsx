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

  _test: function(e) {
    e.preventDefault();
  },

  render: function() {
    var props = this.props;
    var state = this.state;
    return (
      <path
        onMouseOver={this._test}
        onMouseOut={this._test}
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
    color: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolationType: 'linear',
      color: '#fff'
    };
  },

  render: function() {
    var props = this.props;
    var interpolatePath = d3.svg.line()
        .x(function(d) {
          return props.xScale(d.x);
        })
        .y(function(d) {
          return props.yScale(d.y);
        })
        .interpolate(props.interpolationType);

    var circles = props.data.map(function(point, i) {
      return (
        <Circle
          cx={props.xScale(point.x)}
          cy={props.yScale(point.y)}
          r={props.pointRadius}
          fill={props.color}
          key={props.seriesName + i}
          id={props.seriesName + '-' + i}
        />
      );
    });

    return (
      <g>
        <Line
          path={interpolatePath(props.data)}
          stroke={props.color}
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
    strokeWidth: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      axesColor: '#000'
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
          />
          <XAxis
            xAxisClassName={props.xAxisClassName}
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            xScale={props.xScale}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
        </g>
    );
  }

});


var LineChart = exports.LineChart = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    legendOffset: React.PropTypes.number,
    titleOffset: React.PropTypes.number,
    pointRadius: React.PropTypes.number,
    yHideOrigin: React.PropTypes.bool,
    xHideOrigin: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func,
    legend: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      margins: {top: 10, right: 20, bottom: 30, left: 30},
      legendOffset: 120,
      titleOffset: 56,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c()
    };
  },

  _calculateScales: utils.calculateScales, 

  render: function() {

    var props = this.props;

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = props.width - props.margins.left - props.margins.right;
    chartHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      chartWidth = chartWidth - props.legendOffset;
    }

    if (props.title) {
      chartHeight = chartHeight - props.titleOffset;
    }

    var flattenedData = utils.flattenData(props.data);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    pubsub.setMaxListeners(xValues.length + yValues.length);

    var scales = this._calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

    var dataSeriesArray = Object.keys(props.data).map( (seriesName, idx) => {
      return (
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            seriesName={seriesName}
            data={props.data[seriesName]}
            width={chartWidth}
            height={chartHeight}
            color={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={seriesName}
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
        <g transform={trans}>
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
            yAxisClassName="line y axis"
            yScale={scales.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yHideOrigin={props.yHideOrigin}
            xAxisClassName="line x axis"
            xScale={scales.xScale}
            xHideOrigin={props.xHideOrigin}
            strokeWidth="1"
            margins={props.margins}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  },


});
