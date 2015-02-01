'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var _ = require('lodash');

var Region = React.createClass({

  propTypes: {
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

  render: function() {
    console.log(this.props);
    return (
      <g>
        <circle
          fill={this.state.circleColor}
          cx={this.props.cx}
          cy={this.props.cy}
          r={this.state.circleRadius}
        />
        <path
          d={this.props.d}
          fillOpacity={0}
          stroke='#999999'
          onMouseOver={this.props.hoverAnimation ? this.animateCircle : null}
          onMouseOut={this.props.hoverAnimation ? this.restoreCircle : null}
        />
      </g>
    );
  },

  animateCircle: function() {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 ),
      circleColor: this.shade(this.props.fill, -0.2)
    });
  },

  restoreCircle: function() {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 4 / 5 ),
      circleColor: this.props.fill
    });
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

var DataSeries = React.createClass({

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
    var xScale = this.props.xScale;
    var yScale = this.props.yScale;

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.x) })
      .y(function(d){ return yScale(d.y) })
      .clipExtent([[0, 0], [ this.props.width , this.props.height]]);

    function drawPath(d) {
      if(d === undefined) {
        return ; 
      }
      return 'M' + d.join(',') + 'Z';
    }

    var regions = voronoi(this.props.data).map(function(node, i) {
      return (
        <Region
          cx={xScale(node.point.x)} 
          cy={yScale(node.point.y)} 
          r={this.props.pointRadius} 
          fill={node.point.color} 
          d={this._drawPath(node)}
          hoverAnimation={this.props.hoverAnimation} 
          key={i}
        />);
        }.bind(this));

    return (
      <g>
        {regions}
      </g>
    );
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  }

});

var ScatterChart = React.createClass({

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

  _calculateScales: function(props, chartWidth, chartHeight) {

    var allValues = _.flatten(_.values(this.props.data), true);
    var xValues = _.pluck(allValues, 'x');
    var yValues = _.pluck(allValues, 'y');

    var xScale = d3.scale.linear()
      .domain([d3.min([d3.min(xValues), 0]), d3.max(xValues)])
      .range([0, chartWidth]);

    var yScale = d3.scale.linear()
      .domain([d3.min([d3.min(yValues), 0]), d3.max(yValues)])
      .range([chartHeight, 0]);

    return {xScale: xScale, yScale: yScale};

  },

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

    var scales = this._calculateScales(this.props, chartWidth, chartHeight);

    var trans = "translate(" + this.props.margins.left + "," + this.props.margins.top + ")";

    var index = 0;
    var allData = [];
    for(var seriesName in this.props.data) {
      if (this.props.data.hasOwnProperty(seriesName)) {
        /*dataSeriesArray.push(
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
        */
       // urg !!! ugly hack =(
        this.props.data[seriesName].forEach(function(node) {
          node.color = this.props.colors(index); 
        }.bind(this));
        allData = allData.concat(this.props.data[seriesName]);
        index++;
      }
    }
    return (
      <Chart width={this.props.width} height={this.props.height} title={this.props.title}>
        <g transform={trans}>
           <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            data={allData}
            width={chartWidth}
            height={chartHeight}
            pointRadius={this.props.pointRadius}
            hoverAnimation={this.props.hoverAnimation}
          />
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

exports.ScatterChart = ScatterChart;
