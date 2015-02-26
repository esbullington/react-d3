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

var Line = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      strokeWidth: 1.5,
      fill: 'none',
      className: 'rd3-linechart-path'
    };
  },

  getInitialState: function() {
    // state for animation usage
    return {
      lineStrokeWidth: this.props.strokeWidth,
      lineStroke: this.props.stroke
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiSeriesRef.observe(() => {
      var lineStatus = props.voronoiSeriesRef.cursor().deref();
      if (lineStatus === 'active') {
        this._animateLine(props.id);
      } else if (lineStatus === 'inactive') {
        this._restoreLine(props.id);
      }
    });
  },

  componentWillUnmount: function() {
    props.voronoiSeriesRef.destroy();
  },

  _animateLine: function(id) {
    this.setState({ 
      lineStrokeWidth: this.state.lineStrokeWidth * 1.8
    });
  },

  _restoreLine: function(id) {
    this.setState({ 
      lineStrokeWidth: this.props.strokeWidth
    });
  },

  render: function() {
    var props = this.props;
    var state = this.state;
    return (
      <path
        d={props.path}
        stroke={state.lineStroke}
        strokeWidth={state.lineStrokeWidth}
        fill={props.fill}
        className={props.className}
      />
    );
  }

});

var Circle = React.createClass({

  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4',
      className: 'rd3-linechart-circle'
    };
  },

  getInitialState: function() {
    // state for animation usage
    return {
      circleRadius: this.props.r,
      circleColor: this.props.fill
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiRef.observe(() => {
      var circleStatus = props.voronoiRef.cursor().deref();
      var seriesName = props.id.split('-')[0];
      if (circleStatus === 'active') {
        this._animateCircle(props.id);
        props.structure.cursor('voronoiSeries').cursor(seriesName).update(()=>'active');
      } else if (circleStatus === 'inactive') {
        this._restoreCircle(props.id);
        props.structure.cursor('voronoiSeries').cursor(seriesName).update(()=>'inactive');
      }
    });
  },

  componentWillUnmount: function() {
    props.voronoiRef.destroy();
  },

  render: function() {
    var props = this.props;
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={this.state.circleRadius}
        fill={this.state.circleColor}
        id={props.id}
        className={props.className}
      />
    );
  },
  
  _animateCircle: function(id) {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 )
    });
  },

  _restoreCircle: function(id) {
    this.setState({ 
      circleRadius: this.props.r
    });
  }

});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolationType: 'linear',
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      displayDataPoints: true
    };
  },

  _isDate: function(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render: function() {

    var props = this.props;

    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;

    // Create array of paths, which we'll map over
    // to generate SVG lines
    var interpolatePath = d3.svg.line()
        .y(function(d) {
          return props.yScale(props.yAccessor(d));
        })
        .interpolate(props.interpolationType);

    // Check whether or not an arbitrary data element
    // is a date object (at index 0 here)
    // If it's a date, then we set the x scale a bit differently
    if (this._isDate(props.data[0], xAccessor)) {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d).getTime());
        });
    } else {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d));
        });
    }


    // Create an immstruct reference for the series name
    // and set it to 'inactive'
    props.structure.cursor('voronoiSeries').set(props.seriesName, 'inactive');

    // Having set the Voronoi line series name cursor to 'inactive'
    // We now pass on the Voronoi line series name reference to the 
    // *both* the line and circle component
    var voronoiSeriesRef = props.structure.reference(['voronoiSeries', props.seriesName]);


    var circles = null;

    if (props.displayDataPoints) {
      // Map over data to generate SVG circles at data points
      // if datum is a date object, treat it a bit differently
      circles = props.data.map(function(point, i) {
        var cx, cy;
        if (this._isDate(point, xAccessor)) {
          cx = props.xScale(xAccessor(point).getTime());
        } else {
          cx = props.xScale(xAccessor(point));
        }
        if (this._isDate(point, yAccessor)) {
          cy = props.yScale(yAccessor(point).getTime());
        } else {
          cy = props.yScale(yAccessor(point));
        }

        var id= props.seriesName + '-' + i;

        // Create an immstruct reference for the circle id
        // and set it to 'inactive'
        props.structure.cursor('voronoi').set(id, 'inactive');

        // Having set the Voronoi circle id cursor to 'inactive'
        // We now pass on the Voronoi circle id reference to the 
        // circle component, where it will be observed and dereferenced
        var voronoiRef = props.structure.reference(['voronoi', id]);

        return (
          <Circle
            voronoiRef={voronoiRef}
            voronoiSeriesRef={voronoiSeriesRef}
            structure={props.structure}
            cx={cx}
            cy={cy}
            r={props.pointRadius}
            fill={props.fill}
            key={props.seriesName + i}
            id={props.seriesName + '-' + i}
          />
        );
      }, this);
    }

    return (
      <g>
        <Line
          voronoiSeriesRef={voronoiSeriesRef}
          path={interpolatePath(props.data)}
          stroke={props.fill}
          seriesName={props.seriesName}
        />
        {circles}
      </g>
    );
  }

});


var Axes = React.createClass({

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    xHideOrigin: React.PropTypes.bool,
    yAxisClassName: React.PropTypes.string.isRequired,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    yHideOrigin: React.PropTypes.bool,
    chartHeight: React.PropTypes.number.isRequired,
    chartWidth: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      axesColor: '#000'
    };
  },

  render: function() {

    var props = this.props;

    return (
        <g>
          <YAxis
            yAxisClassName={props.yAxisClassName}
            yScale={props.yScale}
            yAxisTickCount={props.yAxisTickCount}
            yHideOrigin={props.yHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
          <XAxis
            xAxisClassName={props.xAxisClassName}
            xScale={props.xScale}
            xAxisTickCount={props.xAxisTickCount}
            strokeWidth={props.strokeWidth}
            xHideOrigin={props.xHideOrigin}
            margins={props.margins}
            width={props.chartWidth}
            height={props.chartHeight}
            stroke={props.axesColor}
          />
        </g>
    );
  }

});


var LineChart = exports.LineChart = React.createClass({

  propTypes: {
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
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      margins: {top: 10, right: 20, bottom: 40, left: 30},
      legendOffset: 120,
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c(),
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      interpolate: false,
      interpolationType: null,
      displayDataPoints: true
    };
  },

  render: function() {

    var structure = immstruct('lineChart', { voronoi: {}, voronoiSeries: {}});

    var props = this.props;

    var interpolationType = props.interpolationType || (props.interpolate ? 'cardinal' : 'linear');

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

    var flattenedData = utils.flattenData(props.data, props.xAccessor, props.yAccessor);

    var allValues = flattenedData.allValues,
        xValues = flattenedData.xValues,
        yValues = flattenedData.yValues;

    var scales = utils.calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + props.margins.left + "," + props.margins.top + ")";

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
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
            interpolationType={interpolationType}
            displayDataPoints={props.displayDataPoints}
          />
      );
    });

    return (
      <Chart
        legend={props.legend}
        data={props.data}
        margins={props.margins}
        colors={props.colors}
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g transform={trans} className='rd3-linechart'>
          {dataSeriesArray}
          <Voronoi
            structure={structure}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={chartWidth}
            height={chartHeight}
          />
          <Axes
            yAxisClassName='rd3-linechart-yaxis'
            yAxisTickCount={props.yAxisTickCount}
            yScale={scales.yScale}
            yHideOrigin={props.yHideOrigin}

            xAxisClassName='rd3-linechart-xaxis'
            xAxisTickCount={props.xAxisTickCount}
            xScale={scales.xScale}
            xHideOrigin={props.xHideOrigin}

            strokeWidth="1"
            margins={props.margins}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            stroke={props.axesColor}
          />
        </g>
      </Chart>
    );
  }

});
