'use strict';

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      offset: 0,
      className: 'rd3-barchart-bar'
    };
  },

  render() {
    return (
      <rect
        className='rd3-barchart-bar'
        {...this.props}
        fill={this.props.fill}
        onMouseOver={this.props.handleMouseOver}
        onMouseLeave={this.props.handleMouseLeave}
      />
    );
  }
});
