'use strict';

var React = require('react');
var d3 = require('d3');
var { Chart, Axis } = require('../common');
var DataSeries = require('./DataSeries');
var utils = require('../utils');
var { CartesianChartPropsMixin, ViewBoxMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, ViewBoxMixin ],

  displayName: 'LineChart',

  propTypes: {
    hoverAnimation: React.PropTypes.bool,
    margins:        React.PropTypes.object,
    overrideSets:   React.PropTypes.object,
    grid:           React.PropTypes.object
 },

  getDefaultProps() {
    return {
      className: 'rd3-linechart',
      margins: { top: 10, right: 20, bottom: 50, left: 45 },
      xAxis: {
        hide: false
      },
      yAxis: {
        className: 'rd3-linechart-yaxis',
        hide: false
      },
      yAxis2: {
        className: 'rd3-linechart-yaxis',
        hide: false
      },
      overrideSets:   {}
    };
  },

  _calculateScales: utils.calculateScales,

  render() {

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return null;
    }

    var xAxisProps = this.props.xAxis || {};
    var yAxisProps = {};
    var yAxis2Props = {};
    if (Array.isArray(this.props.yAxis)) {
      yAxisProps = this.props.yAxis[0] || {};
      yAxisProps.orient = yAxisProps.orient || 'left';
      yAxis2Props = this.props.yAxis[1] || {};
      if (yAxis2Props) {
        yAxis2Props.orient = yAxis2Props.orient || (yAxisProps.orient === 'left' ? 'right' : 'left');
      }
    } else {
      yAxisProps = this.props.yAxis;
    }

    // Calculate inner chart dimensions
    var innerWidth, innerHeight;

    innerWidth = this.getOuterDimensions().width - props.margins.left - props.margins.right;
    innerHeight = this.getOuterDimensions().height - props.margins.top - props.margins.bottom;

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = xAxisProps.tickValues || flattenedData.xValues,
        yValues = yAxisProps.tickValues || flattenedData.yValues,
        xValues2 = flattenedData.xValues2,
        yValues2 = flattenedData.yValues2;
    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues, xAxisProps.range, yAxisProps.range);
    var trans = "translate("
      + (yAxisProps.offset < 0 ? props.margins.left + Math.abs(yAxisProps.offset) : props.margins.left) + ","
      + props.margins.top + ")";

    var scales2, trans2;
    if (xValues2 && yValues2) {
      scales2 = this._calculateScales(innerWidth, innerHeight, xValues2, yValues2, xAxisProps.range, yAxisProps.range2);
      trans2 = "translate("
        + (yAxis2Props.offset < 0 ? props.margins.left + Math.abs(yAxis2Props.offset) : props.margins.left) + ","
        + props.margins.top + ")";
    }

    var xAxis;
    if (!xAxisProps.hide) {
      xAxis = <Axis
        type={'x'}
        {... xAxisProps}
        grid={props.grid}
        scale={scales.xScale}
        xOrient={xAxisProps.orient}
        yOrient={yAxisProps.orient}
        margins={props.margins}
        width={innerWidth}
        height={innerHeight}
      />
    }

    var yAxis;
    if (!yAxisProps.hide) {
      yAxis = <Axis
        type={'y'}
        {... yAxisProps}
        grid={props.grid}
        scale={scales.yScale}
        xOrient={xAxisProps.orient}
        yOrient={yAxisProps.orient}
        margins={props.margins}
        width={innerWidth}
        height={innerHeight}
      />
    }

    return (
      <Chart
        viewBox={this.getViewBox()}
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        colorAccessor={props.colorAccessor}
        width={props.width}
        height={props.height}
        title={props.title}>
        <g transform={trans} className={props.className}>
          {xAxis}
          {yAxis}
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            hoverAnimation={props.hoverAnimation}
            markerOnClick={props.markerOnClick}
            data={props.data}
            value={allValues}
            interpolationType={props.interpolationType}
            colors={props.colors}
            colorAccessor={props.colorAccessor}
            width={innerWidth}
            height={innerHeight}
            xAxisRange={xAxisProps.Range}
            overrideSets={props.overrideSets}
            />
        </g>
      </Chart>
    );
  }

});
