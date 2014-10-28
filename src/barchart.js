/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Bar = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,  
    width: React.PropTypes.number,  
    height: React.PropTypes.number,  
    offset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      offset: 0
    }
  },

  render: function() {
    return (
      <rect 
        fill={this.props.fill}
        width={this.props.width}
        height={this.props.height} 
        x={this.props.offset}
        y={this.props.availableHeight - this.props.height} 
      />
    );
  }
});

var DataSeries = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,  
    title: React.PropTypes.string,  
    padding: React.PropTypes.number,  
    width: React.PropTypes.number,  
    height: React.PropTypes.number,  
    offset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      padding: 0.1,
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var yScale = d3.scale.linear()
      .domain([0, d3.max(this.props.data)])
      .range([0, this.props.height]);

    var xScale = d3.scale.ordinal()
      .domain(d3.range(this.props.data.length))
      .rangeRoundBands([0, this.props.width], this.props.padding);

    var bars = this.props.data.map(function(point, i) {
      return (
        <Bar height={yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} fill={props.fill} key={i} />
      )
    });

    return (
      <g>{bars}</g>
    );
  }
});

var BarChart = React.createClass({

  render: function() {
    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries data={this.props.data} width={this.props.width} height={this.props.height} fill="cornflowerblue" />
      </Chart>
    );
  }

});

exports.BarChart = BarChart;
