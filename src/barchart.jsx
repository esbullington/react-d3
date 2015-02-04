'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;

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
    };
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

var DataSeries = exports.DataSeries = React.createClass({

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
    };
  },

  render: function() {

    var props = this.props;

    var xScale = d3.scale.ordinal()
      .domain(d3.range(props.values.length))
      .rangeRoundBands([0, props.width], props.padding);

    var bars = props.values.map(function(point, i) {
      return (
        <Bar height={props.yScale(0) - props.yScale(point)} width={xScale.rangeBand()} offset={xScale(i)} availableHeight={props.height} fill={props.fill} key={i} />
      );
    });

    return (
      <g>{bars}</g>
    );
  }
});

var BarChart = exports.BarChart = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    yAxisTickCount: React.PropTypes.number,
    width: React.PropTypes.number,
    margins: React.PropTypes.object,
    height: React.PropTypes.number,
    fill: React.PropTypes.string,
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      yAxisTickCount: 4,
      width: 500,
      height: 200,
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      fill: "#3182bd",
      title: ''
    };
  },

  render: function() {

    var props = this.props;

    var values = props.data.map( (item) => item.value );

    var labels = props.data.map( (item) => item.label );

    var margins = props.margins;

    var sideMargins = margins.left + margins.right;
    var topBottomMargins = margins.top + margins.bottom;

    var yScale = d3.scale.linear()
      .domain([d3.min([d3.min(values), 0]), d3.max(values)])
      .range([props.height - topBottomMargins, 0]);

    var xScale = d3.scale.ordinal()
        .domain(labels)
        .rangeRoundBands([0, props.width - sideMargins], 0.1);

    var trans = "translate(" + margins.left + "," + margins.top + ")";

    return (
      <Chart width={props.width} height={props.height} title={props.title}>
        <g transform={trans} >
          <DataSeries
            values={values}
            yScale={yScale}
            xScale={yScale}
            margins={margins}
            data={props.data}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
            fill={props.fill}
          />
          <YAxis
            yAxisClassName="bar y axis"
            yScale={yScale}
            margins={margins}
            yAxisTickCount={props.yAxisTickCount}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
          />
          <XAxis
            xAxisClassName="bar x axis"
            xScale={xScale}
            data={props.data}
            margins={margins}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
          />
        </g>
      </Chart>
    );
  }

});
