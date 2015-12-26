'use strict';

var React = require('react');

module.exports = {
  propTypes: {
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  }
}
