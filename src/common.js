/** @jsx React.DOM */
var React = require('react');
var d3 = require('d3');


exports.Chart = React.createClass({
  render: function() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});

exports.XAxis = React.createClass({


  componentWillReceiveProps: function(props) {

    var unit = props.xAxisTickInterval.unit;
    var interval = props.xAxisTickInterval.interval;

    var xAxis = d3.svg.axis()
      .ticks(props.xAxisTickCount)
      .ticks(d3.time[unit], interval)
      .scale(props.xScale)
      .orient("bottom");

    var node = this.refs.xaxis.getDOMNode();

    d3.select(node)
      .attr("class", "x axis")
      .call(xAxis);

    // Style each of the tick lines
    d3.select('.x.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.select('.x.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    var t = "translate(0," + this.props.height + ")";
    return (
      <g
        ref='xaxis'
        className="x axis"
        transform={t}
      >
      </g>
    );
  }

});


exports.YAxis = React.createClass({

  componentWillReceiveProps: function(props) {

    var yAxis = d3.svg.axis()
      .ticks(props.yAxisTickCount)
      .scale(props.yScale)
      .orient("left");

    var node = this.refs.yaxis.getDOMNode();

    d3.select(node)
      .attr("class", "y axis")
      .call(yAxis);

  },

  render: function() {
    return (
      <g
        ref='yaxis'
        className="y axis"
      >
      </g>
    );
  }

});
