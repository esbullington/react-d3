/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var Chart = require('./common').Chart;
var _ = require('lodash');


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
        y={this.props.availableHeight  - this.props.height} 
      />
    );
  }
});

var XAxis = React.createClass({


  componentWillReceiveProps: function(props) {

    var xAxis = d3.svg.axis()
      .scale(props.xScale)
      .orient("bottom");

    var node = this.refs.barxaxis.getDOMNode();

    d3.select(node)
      .attr("class", "barx axis")
      .call(xAxis);

    // Style each of the tick lines
    d3.select('.barx.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.select('.barx.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "none")

  },

  render: function() {
    var t = "translate(0," + this.props.height + ")"
    return (
      <g
        ref='barxaxis'
        className="barx axis"
        transform={t}
      >
      </g>
    );
  }

});


var YAxis = React.createClass({

  componentWillReceiveProps: function(props) {

    var yAxis = d3.svg.axis()
      .ticks(props.yAxisTickCount)
      .scale(props.yScale)
      .orient("left"); 

    var node = this.refs.baryaxis.getDOMNode();

    d3.select(node)
      .attr("class", "bary axis")
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll('.bary.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", "#000");

    // Style the main axis line
    d3.selectAll('.bary.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", "#000")

  },

  render: function() {
    return (
      <g
        ref='baryaxis'
        className="bary axis"
      >
      </g>
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

    var xScale = d3.scale.ordinal()
      .domain(d3.range(props.values.length))
      .rangeRoundBands([0, this.props.width], this.props.padding);

    var bars = props.values.map(function(point, i) {
      return (
        <Bar height={props.yScale(0) - props.yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} fill={props.fill} key={i} />
      )
    });

    return (
      <g>{bars}</g>
    );
  }
});

var BarChart = React.createClass({

  getDefaultProps: function() {
    return {
      data: [],
      yAxisTickCount: 4,
      width: 500,
      height: 200,
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      fill: "cornflowerblue"
    }
  },

  render: function() {

    var values = _.pluck(this.props.data, 'value');

    var labels = _.pluck(this.props.data, 'label');

    var margins = this.props.margins;

    var sideMargins = margins.left + margins.right;
    var topBottomMargins = margins.top + margins.bottom;

    var yScale = d3.scale.linear()
      .domain([0, d3.max(values)])
      .range([this.props.height - topBottomMargins, 0]);

    var xScale = d3.scale.ordinal()
        .domain(labels)
        .rangeRoundBands([0, this.props.width - sideMargins], 0.1);

    var trans = "translate(" + margins.left + "," + margins.top + ")";

    return (
      <Chart width={this.props.width } height={this.props.height }>
        <g transform={trans} >
          <DataSeries 
            values={values}
            yScale={yScale}
            xScale={yScale}
            margins={margins}
            data={this.props.data}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
            fill={this.props.fill}
          />
          <YAxis 
            yScale={yScale}
            margins={margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
          />
          <XAxis 
            xScale={xScale}
            data={this.props.data}
            margins={margins}
            width={this.props.width - sideMargins}
            height={this.props.height - topBottomMargins}
          />
        </g>
      </Chart>
    );
  }

});

exports.BarChart = BarChart;
