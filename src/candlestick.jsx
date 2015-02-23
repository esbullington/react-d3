'use strict';

var React = require('react');
var d3 = require('d3');
var common = require('./common');
var Chart = common.Chart;
var XAxis = common.XAxis;
var YAxis = common.YAxis;
var Voronoi = common.Voronoi;

var EventEmitter = require('events').EventEmitter;
var pubsub = exports.pubsub = new EventEmitter();

var utils = require('./utils');


var Wicks = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    strokeWidth: React.PropTypes.number,
    stroke: React.PropTypes.string,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    xAccessor: React.PropTypes.func.isRequired,
    yAccessor: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      className: 'rd3-candlestick-line',
      stroke: '#000',
      strokeWidth: 1,
      shapeRendering: "crispEdges"
    };
  },

  render() {
    var wicks = this.props.data
        .map(function(d, idx) {
          var ohlc = this.props.yAccessor(d),
            x1 = this.props.xScale(this.props.xAccessor(d)),
            y1 = this.props.yScale(ohlc.high),
            x2 = x1,
            y2 = this.props.yScale(ohlc.low);

          return <line key={idx}
                  stroke={this.props.stroke}
                  strokeWidth={this.props.strokeWidth}
                  style={{ shapeRendering: this.props.shapeRendering }}
                  className={this.props.className}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2} />;
        }, this);
    return (
      <g className='rd3-candlestick-wicks'>{wicks}</g>
    );
  }
});


var Candle = React.createClass({
  getInitialState() {
    // state for animation usage
    return {
      candleWidth: this.props.width,
      candleFill: this.props.fill
    };
  },

  getDefaultProps() {
    return {
      stroke: '#000',
      strokeWidth: 1,
      shapeRendering: 'crispEdges',
      className: 'rd3-candlestick-rect'
    };
  },
  componentDidMount() {
    pubsub.on('animate', this._animateCandle);
    pubsub.on('restore', this._restoreCandle);
  },

  componentWillUnmount() {
    pubsub.removeListener('animate', this._animateCandle);
    pubsub.removeListener('restore', this._restoreCandle);
  },

  _animateCandle(id) {
    if (this.props.idx == id.split('-')[1]) {
      this.setState({ 
        candleWidth: this.props.width * 1.5,
        candleFill: utils.shade(this.props.fill, -0.2)
      });
    }
  },

  _restoreCandle(id) {
    if (this.props.idx == id.split('-')[1]) {
      this.setState({ 
        candleWidth: this.props.width,
        candleFill: this.props.fill
      });
    }
  },

  render() {
    return (<rect key={this.props.idx} 
                  className={this.props.className} fill={this.state.candleFill}
                  x={this.props.x - ((this.state.candleWidth - this.props.width) / 2)}
                  y={this.props.y}
                  stroke={this.props.stroke}
                  strokeWidth={this.props.strokeWidth}
                  style={{ shapeRendering: this.props.shapeRendering }}
                  width={this.state.candleWidth}
                  height={this.props.height} />);
  }

});


var Candles = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    strokeWidth: React.PropTypes.number,
    stroke: React.PropTypes.string,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    xAccessor: React.PropTypes.func.isRequired,
    yAccessor: React.PropTypes.func.isRequired,
    fillUp: React.PropTypes.string.isRequired,
    fillDown: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      stroke: '#000',
      strokeWidth: 1,
      fillUp: "green",
      fillDown: "red",
      shapeRendering: "crispEdges"
    };
  },

  render() {
    var xRange = this.props.xScale.range(),
        width = Math.abs(xRange[0] - xRange[1]),
        candleWidth = (width / (this.props.data.length + 2)) * 0.5;

    var candles = this.props.data
        .map(function(d, idx) {
          var ohlc = this.props.yAccessor(d),
            x = this.props.xScale(this.props.xAccessor(d)) - 0.5 * candleWidth,
            y = this.props.yScale(Math.max(ohlc.open, ohlc.close)),
            height = Math.abs(this.props.yScale(ohlc.open) - this.props.yScale(ohlc.close)),
            y2 = this.props.yScale(ohlc.low),
            ohlcClass = (ohlc.open <= ohlc.close) ? 'up' : 'down',
            className = `${ ohlcClass } rd3-candlestick-rect`,
            fill = (ohlc.open <= ohlc.close) ? this.props.fillUp : this.props.fillDown;

          return <Candle key={idx} className={className} fill={fill}
                  idx={idx}
                  x={x}
                  y={y}
                  width={candleWidth}
                  height={height} />;
        }, this);
    return (
      <g className='rd3-candlestick-candles'>{candles}</g>
    );
  }
});

var DataSeries = exports.DataSeries = React.createClass({

  propTypes: {
    fillUp: React.PropTypes.string.isRequired,
    fillDown: React.PropTypes.string.isRequired
  },

  render() {

    var props = this.props;

    return (
      <g>
        <Wicks 
          xScale={props.xScale}
          yScale={props.yScale}
          xAccessor={props.xAccessor}
          yAccessor={props.yAccessor}
          data={props.data}
          />
        <Candles 
          xScale={props.xScale}
          yScale={props.yScale}
          xAccessor={props.xAccessor}
          yAccessor={props.yAccessor}
          fillUp={props.fillUp}
          fillDown={props.fillDown}
          data={props.data}
          />
      </g>
    );
  }

});



var CandleStickChart = exports.CandleStickChart = React.createClass({

  propTypes: {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    yAxisTickCount: React.PropTypes.number,
    yAxisFormatter: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    xAxisTickInterval: React.PropTypes.object,
    xAxisFormatter: React.PropTypes.func,
    xAccessor: React.PropTypes.func,
    fillUp: React.PropTypes.func,
    fillDown: React.PropTypes.func,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      data: [],
      fillUp: function (i) { return "white"; },
      fillDown: d3.scale.category20c(),
      margins: {top: 10, right: 20, bottom: 30, left: 40},
      legendOffset: 120,
      width: 400,
      height: 200,
      title: '',
      xAccessor: (d) => d.x,
      yAccessor: (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close })
    };
  },

  render() {

    var props = this.props;

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

    pubsub.setMaxListeners(xValues.length + yValues.length);

    var scales = utils.calculateScales(chartWidth, chartHeight, xValues, yValues);

    var trans = "translate(" + (props.yAxisOffset < 0 ? props.margins.left + Math.abs(props.yAxisOffset) : props.margins.left) + "," + props.margins.top + ")";

    var dataSeries = props.data.map( (series, idx) => {
      return (
          <DataSeries
            key={idx}
            name={series.name}
            colors={props.colors}
            index={idx}
            xScale={scales.xScale}
            yScale={scales.yScale}
            data={series.values}
            fillUp={this.props.fillUp(idx)}
            fillDown={this.props.fillDown(idx)}
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
        );
      });

    return (
      <Chart
        width={this.props.width}
        height={this.props.height}
        margins={this.props.margins}
        title={this.props.title}
      >
        <g transform={trans} className='rd3-candlestick'>
          {dataSeries}
          <Voronoi
            pubsub={pubsub}
            data={allValues}
            xScale={scales.xScale}
            yScale={scales.yScale}
            width={chartWidth}
            height={chartHeight}
          />
          <XAxis
            xAxisClassName='rd3-candlestick-axis x axis'
            xScale={scales.xScale}
            xAxisTickInterval={props.xAxisTickInterval}
            xAxisOffset={props.xAxisOffset}
            xAxisFormatter={props.xAxisFormatter}
            margins={props.margins}
            width={chartWidth}
            height={chartHeight}
          />
          <YAxis
            yAxisClassName='rd3-candlestick-axis y axis'
            yScale={scales.yScale}
            yAxisOffset={props.yAxisOffset}
            yAxisTickCount={props.yAxisTickCount}
            yAxisFormatter={props.yAxisFormatter}
            margins={props.margins}
            width={chartWidth}
            height={props.height}
          />
        </g>
      </Chart>
    );
  }

});
