'use strict';

var React = require('react');
var d3 = require('d3');
var utils = require('../utils');
var CandlestickContainer = require('./CandlestickContainer');


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    fillUp:   React.PropTypes.string.isRequired,
    fillDown: React.PropTypes.string.isRequired
  },

  render() {

    var props = this.props;

    var xRange = props.xScale.range(),
        width = Math.abs(xRange[0] - xRange[1]),
        candleWidth = (width / (props.data.length + 2)) * 0.5;

    var dataSeriesArray = props.data.map( (d, idx)=> {
      // Candles
      var ohlc = props.yAccessor(d),
        candle_x = props.xScale(props.xAccessor(d)) - 0.5 * candleWidth,
        candle_y = props.yScale(Math.max(ohlc.open, ohlc.close)),
        candleHeight = Math.abs(props.yScale(ohlc.open) - props.yScale(ohlc.close)),
        wick_y2 = props.yScale(ohlc.low),
        ohlcClass = (ohlc.open <= ohlc.close) ? 'up' : 'down',
        className = `${ ohlcClass } rd3-candlestick-rect`,
        candleFill = (ohlc.open <= ohlc.close) ? props.fillUp : props.fillDown;

      //Wicks
      var wick_x1 = props.xScale(props.xAccessor(d)),
        wick_y1 = props.yScale(ohlc.high),
        wick_x2 = wick_x1;

      return (
        <CandlestickContainer
          key={idx}
          candleFill={candleFill}
          candleHeight={candleHeight}
          candleWidth={candleWidth}
          candle_x={candle_x}
          candle_y={candle_y}
          wick_x1={wick_x1}
          wick_x2={wick_x2}
          wick_y1={wick_y1}
          wick_y2={wick_y2}
          hoverAnimation={props.hoverAnimation}
        />
      );
    }, this);

    return (
      <g>
        {dataSeriesArray}
      </g>
    );
  }

});
