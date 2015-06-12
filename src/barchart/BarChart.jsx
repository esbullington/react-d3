'use strict';

var React = require('react');
var d3 = require('d3');
var DataSeries = require('./DataSeries');

var { Chart, XAxis, YAxis } = require('../common');
var { CartesianChartPropsMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin ],

  displayName: 'BarChart',

  propTypes: {
    data:           React.PropTypes.array,
    yAxisTickCount: React.PropTypes.number,
    width:          React.PropTypes.number,
    margins:        React.PropTypes.object,
    height:         React.PropTypes.number,
    title:          React.PropTypes.string,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
			nameLabelProp: "label",
			nameValueProp: "value",
      yAxisTickCount: 4,
      margins: {top: 10, right: 20, bottom: 40, left: 45},
      hoverAnimation: true
    };
  },

  render() {

    var props = this.props;

    var values = props.data.map( (item) => item[props.nameValueProp] );

    var labels = props.data.map( (item) => item[props.nameLabelProp] );

    var margins = props.margins;

    var sideMargins = margins.left + margins.right;
    var topBottomMargins = margins.top + margins.bottom;

    var minValue = Math.min(d3.min(values), 0);

    var yScale = d3.scale.linear()
      .domain([minValue, d3.max(values)])
      .range([props.height - topBottomMargins, 0]);

    var xScale = d3.scale.ordinal()
        .domain(labels)
        .rangeRoundBands([0, props.width - sideMargins], 0.1);

    var trans = `translate(${ margins.left },${ margins.top })`;

    return (
      <Chart
        viewBox={props.viewBox}
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className='rd3-barchart'>
          <DataSeries
            values={values}
            labels={labels}
            yScale={yScale}
            xScale={yScale}
            margins={margins}
            data={props.data}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
            colors={props.colors}
            colorAccessor={props.colorAccessor}
            hoverAnimation={props.hoverAnimation}
          />
          <YAxis
            yAxisClassName='rd3-barchart-yaxis'
            yAxisTickValues={props.yAxisTickValues}
            yAxisLabel={props.yAxisLabel}
            yAxisLabelOffset={props.yAxisLabelOffset}
            yScale={yScale}
            margins={margins}
            yAxisTickCount={props.yAxisTickCount}
            tickFormatting={props.yAxisFormatter}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
          />
          <XAxis
            xAxisClassName='rd3-barchart-xaxis'
            xAxisTickValues={props.xAxisTickValues}
            xAxisLabel={props.xAxisLabel}
            xAxisLabelOffset={props.xAxisLabelOffset}
            xScale={xScale}
            data={props.data}
            margins={margins}
            tickFormatting={props.xAxisFormatter}
            width={props.width - sideMargins}
            height={props.height - topBottomMargins}
          />
        </g>
      </Chart>
    );
  }

});
