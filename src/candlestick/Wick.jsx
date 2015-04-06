'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Wick',

  propTypes: {
    strokeWidth: React.PropTypes.number,
    stroke: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      className: 'rd3-candlestick-wick',
      stroke: '#000',
      strokeWidth: 1,
      shapeRendering: "crispEdges"
    };
  },

  render() {
    var props = this.props;
    return <line
            stroke={props.stroke}
            strokeWidth={props.strokeWidth}
            style={{ shapeRendering: props.shapeRendering }}
            className={props.className}
            x1={props.x1}
            y1={props.y1}
            x2={props.x2}
            y2={props.y2}
          />;
  }

});
