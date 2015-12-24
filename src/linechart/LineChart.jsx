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
      overrideSets:   {}
    };
  },

  _calculateScales: utils.calculateScales,

  render() {
    var props = Object.assign({}, this.props);

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
        xValues = (xAxisProps.ticks && xAxisProps.ticks.values) || flattenedData.xValues,
        yValues = (yAxisProps.ticks && yAxisProps.ticks.values) || flattenedData.yValues,
        xValues2 = xValues,
        yValues2 = (yAxis2Props.ticks && yAxis2Props.ticks.values) || flattenedData.yValues2;
    var scales = this._calculateScales(innerWidth, innerHeight, xValues, yValues, xAxisProps.range, yAxisProps.range);
    var trans = "translate("
      + (yAxisProps.offset < 0 ? props.margins.left + Math.abs(yAxisProps.offset) : props.margins.left) + ","
      + props.margins.top + ")";

    var scales2 = {};
    var yAxis2;
    if (xValues2.length > 0 && yValues2.length > 0) {
      scales2 = this._calculateScales(innerWidth, innerHeight, xValues.concat(xValues2), yValues2, xAxisProps.range,
          yAxis2Props.range);
      scales.xScale = scales2.xScale;
      if (!yAxis2Props.orient) {
        yAxis2Props.orient = yAxis2Props.orient || (yAxisProps.orient === 'left' ? 'right' : 'left');
      }
      if (!yAxis2Props.hide) {
        yAxis2 = <Axis
          type={'y'}
          {... yAxis2Props}
          grid={props.grid}
          scale={scales2.yScale}
          xOrient={xAxisProps.orient}
          yOrient={yAxis2Props.orient}
          margins={props.margins}
          width={innerWidth}
          height={innerHeight}
        />
      }
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
          {yAxis2}
          <DataSeries
            xScale={scales.xScale}
            yScale={scales.yScale}
            xScale2={scales2.xScale}
            yScale2={scales2.yScale}
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
