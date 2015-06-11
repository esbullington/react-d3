'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Wick',

  propTypes: {
    className:      React.PropTypes.string,
    shapeRendering: React.PropTypes.string,
    stroke:         React.PropTypes.string,
    strokeWidth:    React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      className:      'rd3-candlestick-wick',
      stroke:         '#000',
      strokeWidth:    1,
      shapeRendering: 'crispEdges',
    };
  },

  render() {
    var props = this.props;
    return <line
            stroke={props.stroke}
            strokeWidth={props.strokeWidth}
            style={{ shapeRendering: props.shapeRendering }}
            className={props.className}
            x1={props.wick_x1}
            y1={props.wick_y1}
            x2={props.wick_x2}
            y2={props.wick_y2}
          />;
  }

});
