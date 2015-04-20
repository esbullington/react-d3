'use strict';

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      offset: 0
    };
  },

  render() {
    return (
      <rect
        fill={this.props.fill}
        width={this.props.width}
        height={Math.abs(this.props.height)}
        x={this.props.x}
        y={this.props.y}
        className='rd3-barchart-bar'
      />
    );
  }
});
