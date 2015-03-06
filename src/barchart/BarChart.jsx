'use strict';

var React = require('react');
var d3 = require('d3');
var DataSeries = require('./DataSeries');
var common = require('../common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;

module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    yAxisTickCount: React.PropTypes.number,
    width: React.PropTypes.number,
    margins: React.PropTypes.object,
    height: React.PropTypes.number,
    fill: React.PropTypes.string,
    title: React.PropTypes.string
  },

  getDefaultProps() {
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

  render() {

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
        <g transform={trans} className='rd3-barchart'>
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
            yAxisClassName='rd3-barchart-yaxis'
            yScale={yScale}
            margins={margins}
            yAxisTickCount={props.yAxisTickCount}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
          />
          <XAxis
            xAxisClassName='rd3-barchart-xaxis'
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
