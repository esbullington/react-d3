'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;
var EventEmitter = require('events').EventEmitter
var pubsub = exports.pubsub = new EventEmitter;
var utils = require('./common/utils');

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
    } 
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
        circleColor: this._shade(this.props.fill, -0.2)
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

  _shade: utils.shade 

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

  _calculateScales: utils.calculateScales,

  render: function() {

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = this.props.width - this.props.margins.left - this.props.margins.right;
    chartHeight = this.props.height - this.props.margins.top - this.props.margins.bottom;

    if (this.props.legend) {
      chartWidth = chartWidth - this.props.legendOffset;
    }

    if (this.props.title) {
      chartHeight = chartHeight - this.props.titleOffset;
    }

    var allData = utils.concatData(this.props.data), 
        allValues = allData.allValues,
        xValues = allData.xValues,
        yValues = allData.yValues;

    // Set pubsub max listeners to total number of nodes to be created
    pubsub.setMaxListeners(xValues.length + yValues.length)

    var scales = this._calculateScales(this.props, chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + this.props.margins.left + "," + this.props.margins.top + ")";

    var index = 0;
    var dataSeriesArray = [];
    for(var seriesName in this.props.data) {
      if (this.props.data.hasOwnProperty(seriesName)) {
        dataSeriesArray.push(
            <DataSeries
              xScale={scales.xScale}
              yScale={scales.yScale}
              seriesName={seriesName}
              data={this.props.data[seriesName]}
              width={chartWidth}
              height={chartHeight}
              color={this.props.colors(index)}
              pointRadius={this.props.pointRadius}
              key={seriesName}
              hoverAnimation={this.props.hoverAnimation}
            />
        );
        index++;
      }
    }

    return (
      <Chart width={this.props.width} height={this.props.height} title={this.props.title}>
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
            yHideOrigin={this.props.yHideOrigin}
            margins={this.props.margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={chartWidth}
            height={chartHeight}
            stroke={this.props.axesColor}
          />
          <XAxis
            xAxisClassName="scatter x axis"
            strokeWidth="1"
            xHideOrigin={this.props.xHideOrigin}
            xScale={scales.xScale}
            data={this.props.data}
            margins={this.props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={this.props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
