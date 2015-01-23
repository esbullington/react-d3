'use strict';

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

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    orient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    hideOrigin: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      xAxisClassName: 'x axis',
      orient: 'bottom',
      fill: "none",
      stroke: "none",
      tickStroke: "#000",
      strokeWidth: "none",
      hideOrigin: false
    };
  },


  componentDidMount: function() {
    this._renderAxis(this.props);
  },

  componentWillReceiveProps: function(props) {
    this._renderAxis(props);
  },

  _renderAxis: function(props) {
    var xAxis = d3.svg.axis()
      .scale(props.xScale)
      .orient("bottom");

    if (props.xAxisTickInterval) {
      xAxis.ticks(d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval);
    } else if (props.xAxisTickCount) {
      xAxis.ticks(props.xAxisTickCount);
    }

    xAxisClassSelect = props.xAxisClassName.replace(/ /g, '.');

    if (xAxisClassSelect[0] != '.') {
      xAxisClassSelect = '.' + xAxisClassSelect;
    }

    var node = this.refs.xaxis.getDOMNode();

    d3.select(node)
      .attr("class", props.xAxisClassName)
      .call(xAxis);

    // Style each of the tick lines
    d3.select(xAxisClassSelect)
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", props.tickStroke);

    // Style the main axis line
    d3.select(xAxisClassSelect)
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", props.fill)
      .attr("stroke", props.stroke)
      .attr("stroke-width", props.strokeWidth);

    if (props.hideOrigin) {
      // Hack to hide the x axis origin
      var originSelect = xAxisClassSelect + ' g:first-child';
      d3.selectAll(originSelect).style("opacity","0");
    }

  },

  render: function() {
    var props = this.props;
    var t = "translate(0," + props.height + ")";
    return (
      <g
        ref='xaxis'
        className={props.xAxisClassName}
        transform={t}
      >
      </g>
    );
  }

});


exports.YAxis = React.createClass({

  propTypes: {
    yAxisClassName: React.PropTypes.string,
    orient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      yAxisClassName: 'y axis',
      orient: 'left',
      fill: "none",
      stroke: "#000",
      tickStroke: "#000",
      strokeWidth: "none"
    };
  },

  componentDidMount: function() {
    this._renderAxis(this.props);
  },

  componentWillReceiveProps: function(props) {
    this._renderAxis(props);
  },

  _renderAxis: function(props) {

    var yAxis = d3.svg.axis()
      .ticks(props.yAxisTickCount)
      .scale(props.yScale)
      .orient(this.props.orient);

    if (props.yAxisTickCount) {
      yAxis.ticks(props.yAxisTickCount);
    } else if (props.yAxisTickInterval) {
      yAxis.ticks(d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval);
    }

    yAxisClassSelect = props.yAxisClassName.replace(/ /g, '.');

    if (yAxisClassSelect[0] != '.') {
      yAxisClassSelect = '.' + yAxisClassSelect;
    }

    var node = this.refs.yaxis.getDOMNode();

    d3.select(node)
      .attr("class", props.yAxisClassName)
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll(yAxisClassSelect)
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", props.tickStroke);

    // Style the main axis line
    d3.selectAll(yAxisClassSelect)
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", props.fill)
      .attr("stroke", props.stroke)

  },

  render: function() {
    var props = this.props;
    return (
      <g
        ref='yaxis'
        className={props.yAxisClassName}
      >
      </g>
    );
  }

});
