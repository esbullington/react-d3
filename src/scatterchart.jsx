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
    pubsub.on('animateCircle', this._animateCircle);
    pubsub.on('restoreCircle', this._restoreCircle);
  },

  componentWillUnmount: function() {
    pubsub.removeListener('animateCircle', this._animateCircle);
    pubsub.removeListener('restoreCircle', this._restoreCircle);
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
        circleColor: this.shade(this.props.fill, -0.2)
      });
    }
  },

  _restoreCircle: function(id) {
    if (this.props.id === id) {
      this.setState({ 
        circleRadius: this.state.circleRadius * ( 4 / 5 ),
        circleColor: this.props.fill
      });
    }
  },

  shade: function(hex, percent) {
    var R, G, B, red, green, blue, number;
    var min = Math.min, round = Math.round;
    if(hex.length !== 7) { return hex; }
    number = parseInt(hex.slice(1), 16); 
    R = number >> 16;
    G = number >> 8 & 0xFF;
    B = number & 0xFF;
    red = min( 255, round( ( 1 + percent ) * R )).toString(16);
    green = min( 255, round( ( 1 + percent ) * G )).toString(16);
    blue = min( 255, round( ( 1 + percent ) * B )).toString(16);
    return '#' + red + green + blue; 
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

    var circles = this.props.data.map(function(point, i) {
      return (<Circle cx={this.props.xScale(point.x)} cy={this.props.yScale(point.y)} r={this.props.pointRadius} fill={this.props.color} key={this.props.seriesName + i} id={this.props.seriesName + '-' + i} />);
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
    legend: React.PropTypes.bool,
    hoverAnimation: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      legendOffset: 120,
      titleOffset: 56,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      hoverAnimation: true
    };
  },

  _calculateScales: function(props, chartWidth, chartHeight, xValues, yValues) {

    var xScale = d3.scale.linear()
      .domain([d3.min([d3.min(xValues), 0]), d3.max(xValues)])
      .range([0, chartWidth]);

    var yScale = d3.scale.linear()
      .domain([d3.min([d3.min(yValues), 0]), d3.max(yValues)])
      .range([chartHeight, 0]);

    return {xScale: xScale, yScale: yScale};

  },

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

    var allValues = [];
    var xValues = [];
    var yValues = [];
    var coincidentCoordinateCheck = {};

    Object.keys(props.data).forEach( function(seriesName) {
      props.data[seriesName].forEach(function(item, idx) {
        // Check for NaN since d3's Voronoi cannot handle NaN values
        // Go ahead and Proceed to next iteration since we don't want NaN
        // in allValues or in xValues or yValues
        if (isNaN(item.x) || isNaN(item.y)) {
          return;
        }
        xValues.push(item.x);
        yValues.push(item.y);
        var xyCoords = item.x + "-" + item.y;
        if (xyCoords in coincidentCoordinateCheck) {
          // Proceed to next iteration if the x y pair already exists
          // d3's Voronoi cannot handle NaN values or coincident coords
          // But we push them into xValues and yValues above because
          // we still may handle them there (labels, etc.)
          return;
        }
        coincidentCoordinateCheck[xyCoords] = '';
        var pointItem = {
          coord: {
            x: item.x,
            y: item.y,
          },
          id: seriesName + '-' + idx
        };
        allValues.push(pointItem);
      });
    });

    // Set pubsub max listeners to total number of nodes to be created
    pubsub.setMaxListeners(xValues.length + yValues.length);

    var scales = this._calculateScales(props, chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

    var index = 0;
    var dataSeriesArray = [];
    for(var seriesName in props.data) {
      if (props.data.hasOwnProperty(seriesName)) {
        dataSeriesArray.push(
            <DataSeries
              xScale={scales.xScale}
              yScale={scales.yScale}
              seriesName={seriesName}
              data={props.data[seriesName]}
              width={chartWidth}
              height={chartHeight}
              color={props.colors(index)}
              pointRadius={props.pointRadius}
              key={seriesName}
              hoverAnimation={props.hoverAnimation}
            />
        );
        index++;
      }
    }

    return (
      <Chart width={props.width} height={props.height} title={props.title}>
        <g transform={trans}>
          <Voronoi
            pubsub={pubsub}
            data={allValues}
            yScale={scales.yScale}
            xScale={scales.xScale}
            width={chartWidth}
            height={chartHeight}
          />
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
