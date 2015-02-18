'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Brush = common.Brush;
var Voronoi = common.Voronoi;
var EventEmitter = require('events').EventEmitter;
var pubsub = exports.pubsub = new EventEmitter();
var utils = require('./utils');

var Circle = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    strokeOpacity: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4'
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
    pubsub.on('animate', this._animateCircle);
    pubsub.on('restore', this._restoreCircle);
  },

  componentWillUnmount: function() {
    pubsub.removeListener('animate', this._animateCircle);
    pubsub.removeListener('restore', this._restoreCircle);
  },

  render: function() {
    return (
      <circle
        fill={this.state.circleColor}
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.state.circleRadius}
        id={this.props.id}
      />
    );
  },

  _animateCircle: function(id) {
    if (this.props.id === id) {
      this.setState({ 
        circleRadius: this.state.circleRadius * ( 5 / 4 ),
        circleColor: utils.shade(this.props.fill, -0.2)
      });
    }
  },

  _restoreCircle: function(id) {
    if (this.props.id === id) {
      this.setState({ 
        circleRadius: this.props.r,
        circleColor: this.props.fill
      });
    }
  }

});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      data: [],
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  },

  render: function() {

    var props = this.props;

    var circles = props.data.map(function(point, i) {

      var xAccessor = props.xAccessor,
          yAccessor = props.yAccessor,
          cx, cy;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }

      return (<Circle
        cx={cx}
        cy={cy}
        r={props.pointRadius}
        fill={props.fill}
        key={props.seriesName + i}
        id={props.seriesName + '-' + i}
      />);
    }.bind(this));

    return (
      <g>
        {circles}
      </g>
    );
  }

});


var ScatterChart = exports.ScatterChart = React.createClass({

  propTypes: {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
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
    hoverAnimation: React.PropTypes.bool,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
 },

  getDefaultProps: function() {
    return {
      data: [],
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      legendOffset: 120,
      legend: false,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      hoverAnimation: true,
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  },

  _calculateScales: utils.calculateScales,

  render: function() {

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return <g></g>;
    }

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

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    // Set pubsub max listeners to total number of nodes to be created
    pubsub.setMaxListeners(xValues.length + yValues.length);

    var scales = this._calculateScales(chartWidth, chartHeight, xValues, yValues);

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
            hoverAnimation={props.hoverAnimation}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
      );
    });

    return (
      <Chart 
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width} height={props.height}
        title={props.title}>
        <g transform={trans}>
          {props.brushEnabled ?
            /* Brushes and Voronois are incompatible, at the moment */
            <Brush
              yScale={scales.yScale}
              xScale={scales.xScale}
            />
            :
            <Voronoi
              pubsub={pubsub}
              data={allValues}
              yScale={scales.yScale}
              xScale={scales.xScale}
              width={chartWidth}
              height={chartHeight}
            />
          }
          {dataSeriesArray}
          <YAxis
            yAxisClassName="scatter y axis"
            yScale={scales.yScale}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            yAxisTickCount={props.yAxisTickCount}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
          />
          <XAxis
            xAxisClassName="scatter x axis"
            strokeWidth="1"
            xHideOrigin={props.xHideOrigin}
            xAxisTickInterval={props.xAxisTickInterval}
            xScale={scales.xScale}
            data={props.data}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
