'use strict';

var React = require('react');

module.exports = React.createClass({

  displayName: 'Candle',

  propTypes: {
    className:      React.PropTypes.string,
    shapeRendering: React.PropTypes.string,
    stroke:         React.PropTypes.string,
    strokeWidth:    React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      className:      'rd3-candlestick-candle',
      shapeRendering: 'crispEdges',
      stroke:         '#000',
      strokeWidth:    1,
    };
  },

  render() {
    var props = this.props;

    return (
      <rect
        className={props.className}
        fill={props.candleFill}
        x={props.candle_x}
        y={props.candle_y}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        style={{ shapeRendering: props.shapeRendering }}
        width={props.candleWidth}
        height={props.candleHeight}
        onMouseOver={props.handleMouseOver}
        onMouseLeave={props.handleMouseLeave}
      />
    );
  }

});
