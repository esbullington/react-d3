/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Arc = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number
  },

  render: function() {
    var arc = d3.svg.arc()
      .innerRadius(this.props.innerRadius)
      .outerRadius(this.props.outerRadius)
      .startAngle(this.props.startAngle)
      .endAngle(this.props.endAngle);
    return (
      <path 
        className='arc'
        d={arc()}
        fill={this.props.fill}
      />
    );
  }
});

var DataSeries = React.createClass({

  propTypes: {
    transform: React.PropTypes.string,
    data: React.PropTypes.array,
    innerRadius: React.PropTypes.number,
    radius: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      innerRadius: 0,
      data: [],
      color: d3.scale.category20c()
    }
  },

  render: function() {
    var props = this.props;

    var pie = d3.layout
      .pie()
      .sort(null);
    
    var arcData = pie(props.data);

    var color = this.props.color;

    var arcs = [];
    arcData.forEach(function(arc, i) {
      arcs.push(
        <Arc
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          outerRadius={props.radius}
          innerRadius={props.innerRadius}
          fill={color(i)}
          key={i}
        />
      )
    });
    return (
      <g transform={this.props.transform} >{arcs}</g>
    );
  }
});

var PieChart = React.createClass({

  propTypes: {
    radius: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    color: React.PropTypes.func
  },

  render: function() {
    var transform = "translate(" 
      + (this.props.cx || this.props.width/2) + "," 
      + (this.props.cy || this.props.height/2) + ")";
    return (
      <Chart className='pie-chart' width={this.props.width} height={this.props.height}>
        <DataSeries color={this.props.color} transform={transform} data={this.props.data} width={this.props.width} height={this.props.height} radius={this.props.radius} innerRadius={this.props.innerRadius} />
      </Chart>
    );
  }

});

exports.PieChart = PieChart;
