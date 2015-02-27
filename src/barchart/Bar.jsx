'use strict';

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    offset: React.PropTypes.number
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
        height={this.props.height}
        x={this.props.offset}
        y={this.props.availableHeight  - this.props.height}
        className='rd3-barchart-bar'
      />
    );
  }
});
