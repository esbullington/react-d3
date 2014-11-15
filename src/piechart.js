/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var _ = require('lodash');
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
    // transform={"translate(" + arc.centroid() + ")"}
    props = this.props;
    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    var rotate = "rotate(" + (props.startAngle+props.endAngle)/2 * (180/Math.PI) + ")";
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 55;
    var angle  = (props.startAngle + props.endAngle) / 2; // Middle of wedge
    var x      = dist * Math.sin(angle);
    var y      = -dist * Math.cos(angle);
    var t = "translate(" + x + "," + y + ")";
    console.log(rotate);
    return (
      <g>
        <path 
          className='arc'
          d={arc()}
          fill={this.props.fill}
        />
        <line
          x1="0"
          x2="0"
          y1={-radius - 2}
          y2={-radius - 20}
          stroke={"black"}
          transform={rotate}
        >
        </line>
        <text 
          transform={t}
          dy=".35em"
          style={{"textAnchor": "middle", "fill": "black"}}>
          {this.props.label}
        </text>
        <text 
          transform={"translate(" + arc.centroid() + ")"}
          dy=".35em"
          style={{"textAnchor": "middle", "fill": "white"}}>
          {this.props.value + "%"}
        </text>
      </g>
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
          label={props.labels[i]}
          value={props.data[i]}
          key={i}
          width={props.width}
        />
      )
    });
    return (
      <g transform={this.props.transform} >{arcs}</g>
    );
  }
});

var PieChart = React.createClass({

  getDefaultProps: function() {
    return {
    }
  },

  propTypes: {
    radius: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    color: React.PropTypes.func
  },

  render: function() {
    var props = this.props;
    var transform = "translate(" 
      + (this.props.cx || this.props.width/2) + "," 
      + (this.props.cy || this.props.height/2) + ")";
    var data = _.pluck(this.props.data, 'value');
    var labels = _.pluck(this.props.data, 'label');
    return (
      <Chart className='pie-chart' width={this.props.width} height={this.props.height}>
            <DataSeries  labels={labels} color={this.props.color} transform={transform} data={data} width={this.props.width} height={this.props.height} radius={this.props.radius} innerRadius={this.props.innerRadius} />
      </Chart>
    );
  }

});

exports.PieChart = PieChart;
