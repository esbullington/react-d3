'use strict';

var React = require('react');
var d3 = require('d3');
var utils = require('../utils');
var Candle = require('./Candle');
var Wick = require('./Wick');


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
        x = props.xScale(props.xAccessor(d)) - 0.5 * candleWidth,
        y = props.yScale(Math.max(ohlc.open, ohlc.close)),
        height = Math.abs(props.yScale(ohlc.open) - props.yScale(ohlc.close)),
        y2 = props.yScale(ohlc.low),
        ohlcClass = (ohlc.open <= ohlc.close) ? 'up' : 'down',
        className = `${ ohlcClass } rd3-candlestick-rect`,
        fill = (ohlc.open <= ohlc.close) ? props.fillUp : props.fillDown;

      //Wicks
      var x1 = props.xScale(props.xAccessor(d)),
        y1 = props.yScale(ohlc.high),
        x2 = x1;

      // Create unique id: series + index
      var id = props.seriesName + '-' + idx;

      // Create an immstruct reference for the candle id
      // and set it to 'inactive'
      props.structure.cursor('voronoi').set(id, 'inactive');

      // Having set the Voronoi circle id cursor to 'inactive'
      // We now pass on the Voronoi circle id reference to the
      // circle component, where it will be observed and dereferenced
      var voronoiRef = props.structure.reference(['voronoi', id]);


      return (
        <g key={idx} >
          <Wick
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
          />
          <Candle
            voronoiRef={voronoiRef}
            fill={fill}
            id={id}
            x={x}
            y={y}
            width={candleWidth}
            height={height}
          />
        </g>
      );
    }, this);

    return (
      <g>
        {dataSeriesArray}
      </g>
    );
  }

});
