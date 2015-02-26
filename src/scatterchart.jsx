'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;
var utils = require('./utils');
var immstruct = require('immstruct');

var Circle = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    strokeOpacity: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fill: '#1f77b4',
      className: 'rd3-scatterchart-circle'
    };
  },

  getInitialState() {
    // state for animation usage
    return {
      circleRadius: this.props.r,
      circleFill: this.props.fill,
      unobserve: null
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiRef.observe(() => {
      var circleStatus = props.voronoiRef.cursor().deref();
      if (circleStatus === 'active') {
        this._animateCircle(props.id);
      } else if (circleStatus === 'inactive') {
        this._restoreCircle(props.id);
      }
    });
  },

  componentWillUnmount() {
    props.voronoiRef.destroy();
  },

  render() {
    return (
      <circle
        fill={this.state.circleFill}
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.state.circleRadius}
        id={this.props.id}
        className={this.props.className}
      />
    );
  },

  _handleMouseoverEvent(id) {
    if (circleStatus === 'active') {
      this._animateCircle(id);
    } else {
      this._restoreCircle(id);
    }
  },

  _animateCircle(id) {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 ),
      circleFill: utils.shade(this.props.fill, -0.2)
    });
  },

  _restoreCircle(id) {
    this.setState({ 
      circleRadius: this.props.r,
      circleFill: this.props.fill
    });
  }

});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      data: [],
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  },

  render() {

    var props = this.props;

    var circles = props.data.map((point, i) => {

      var xAccessor = props.xAccessor,
          yAccessor = props.yAccessor,
          cx, cy;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }

      var id = props.seriesName + '-' + i;

      // Create an immstruct reference for the circle id
      // and set it to 'inactive'
      props.structure.cursor('voronoi').set(id, 'inactive');

      // Having set the Voronoi circle id cursor to 'inactive'
      // We now pass on the Voronoi circle id reference to the 
      // circle component, where it will be observed and dereferenced
      var voronoiRef = props.structure.reference(['voronoi', id]);

      return (<Circle
        voronoiRef={voronoiRef}
        cx={cx}
        cy={cy}
        r={props.pointRadius}
        fill={props.fill}
        key={props.seriesName + i}
        id={props.seriesName + '-' + i}
      />);
    }, this);

    return (
      <g>
        {circles}
      </g>
    );
  }

});


var ScatterChart = exports.ScatterChart = React.createClass({

  propTypes: {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    margins: React.PropTypes.object,
    legendOffset: React.PropTypes.number,
    pointRadius: React.PropTypes.number,
    yHideOrigin: React.PropTypes.bool,
    xHideOrigin: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func,
    legend: React.PropTypes.bool,
    hoverAnimation: React.PropTypes.bool,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
 },

  getDefaultProps() {
    return {
      data: [],
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      legendOffset: 120,
      legend: false,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      hoverAnimation: true,
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  },

  _calculateScales: utils.calculateScales,

  render() {

    var structure = immstruct('scatterChart', { voronoi: {}});

    var props = this.props;

    if (this.props.data && this.props.data.length < 1) {
      return <g></g>;
    }

    // Calculate inner chart dimensions
    var chartWidth, chartHeight;

    chartWidth = props.width - props.margins.left - props.margins.right;
    chartHeight = props.height - props.margins.top - props.margins.bottom;

    if (props.legend) {
      chartWidth = chartWidth - props.legendOffset;
    }

    if (!Array.isArray(props.data)) {
      props.data = [props.data];
    }

    // Returns an object of flattened allValues, xValues, and yValues
    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = this._calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + (props.yAxisOffset < 0 ? props.margins.left + Math.abs(props.yAxisOffset) : props.margins.left) + "," + props.margins.top + ")";

    var dataSeriesArray = props.data.map( (series, idx) => {
      return (
          <DataSeries
            structure={structure}
            xScale={scales.xScale}
            yScale={scales.yScale}
            seriesName={series.name}
            data={series.values}
            width={chartWidth}
            height={chartHeight}
            fill={props.colors(idx)}
            pointRadius={props.pointRadius}
            key={series.name}
            hoverAnimation={props.hoverAnimation}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
      );
    });

    return (
      <Chart 
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width} height={props.height}
        title={props.title}>
        <g transform={trans} className='rd3-scatterchart'>
          <Voronoi
            structure={structure}
            data={allValues}
            yScale={scales.yScale}
            xScale={scales.xScale}
            width={chartWidth}
            height={chartHeight}
          />
          {dataSeriesArray}
          <XAxis
            xAxisClassName="rd3-scatterchart-xaxis"
            strokeWidth="1"
            xHideOrigin={props.xHideOrigin}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisOffset={props.xAxisOffset}
            xScale={scales.xScale}
            data={props.data}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
          />
          <YAxis
            yAxisClassName="rd3-scatterchart-yaxis"
            yScale={scales.yScale}
            yAxisOffset={props.yAxisOffset}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            yAxisTickCount={props.yAxisTickCount}
            width={chartWidth}
            height={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
