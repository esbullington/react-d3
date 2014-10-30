/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Arc = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      innerRadius: 0
    }
  },

  render: function() {
    var arc = d3.svg.arc()
      .innerRadius(this.props.innerRadius)
      .outerRadius(this.props.outerRadius)
      .startAngle(this.props.startAngle)
      .endAngle(this.props.endAngle);
    return (
      <path 
        d={arc}
        fill={this.props.fill}
      />
    );
  }
});

var DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    radius: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var pie = d3.layout
      .pie()
      .sort(null);
    
    var arcData = pie(props.data);

    var colors = d3.scale.category20c();

    var arcs = arcData.forEach(function(arc, i) {
      return (
        <Arc
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          outerRadius={props.radius}
          fill={color(i)}
          key={i}
        />
      )
    });

    return (
      <g>{arcs}</g>
    );
  }
});

var PieChart = React.createClass({

  render: function() {
    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries data={this.props.data} width={this.props.width} height={this.props.height} radius={this.props.radius} />
      </Chart>
    );
  }

});

exports.PieChart = PieChart;
