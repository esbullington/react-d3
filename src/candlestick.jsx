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

var Wicks = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    yScale: React.PropTypes.func.isRequired,
    xScale: React.PropTypes.func.isRequired,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      strokeWidth: 1,
      shapeRendering: "crispEdges",
      fill: 'none',
      className: 'rd3-candlestick-wick'
    };
  },

  _test: function(e) {
    e.preventDefault();
  },

  render: function() {
    var props = this.props;

    var wicks = props.data
        .map(function(d, i) {
          var x1 = this.props.xScale(d.date),
            y1 = this.props.yScale(d.high),
            x2 = x1,
            y2 = this.props.yScale(d.low);

          return (<line key={i}
                  className={props.className}
                  stroke={props.stroke}
                  fill={props.fill}
                  shapeRendering={props.shapeRendering}
                  strokeWidth={props.strokeWidth}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2} />);
        });

    return (
      <g>
        {wicks}
      </g>
    );
  }

});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    color: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      color: '#fff'
    };
  },

  render: function() {
    var props = this.props;

    return (
      <Wicks
        stroke={props.color}
        xScale={props.xScale}
        yScale={props.yScale}
        data={props.data} />
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


var CandleStickChart = exports.CandleStickChart = React.createClass({

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

    var xScale = d3.time.scale()
      .range([0, props.width])
      .domain(d3.extent(props.data, function(d) { return d.date; }));;


    var scales = this._calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";
    console.table(props.data);
    return (
      <Chart
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans}>
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            data={props.data}
            width={chartWidth}
            height={chartHeight}
            pointRadius={props.pointRadius}
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
