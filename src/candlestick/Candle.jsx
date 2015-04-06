'use strict';

var React = require('react');
var utils = require('../utils');


module.exports = React.createClass({

  displayName: 'Candle',

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
      className: 'rd3-candlestick-candle'
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    props.voronoiRef.observe(() => {
      var candleStatus = props.voronoiRef.cursor().deref();
      if (candleStatus === 'active') {
        this._animateCandle(props.id);
      } else if (candleStatus === 'inactive') {
        this._restoreCandle(props.id);
      }
    });
  },

  componentWillUnmount() {
    this.props.voronoiRef.destroy();
  },


  _animateCandle(id) {
    this.setState({ 
      candleWidth: this.props.width * 1.5,
      candleFill: utils.shade(this.props.fill, -0.2)
    });
  },

  _restoreCandle(id) {
    this.setState({ 
      candleWidth: this.props.width,
      candleFill: this.props.fill
    });
  },

  render() {
    return (
      <rect
        className={this.props.className}
        fill={this.state.candleFill}
        x={this.props.x - ((this.state.candleWidth - this.props.width) / 2)}
        y={this.props.y}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth}
        style={{ shapeRendering: this.props.shapeRendering }}
        width={this.state.candleWidth}
        height={this.props.height}
      />
    );
  }

});
