'use strict';

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    path: React.PropTypes.string,
    fill: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      fill: '#3182bd'
    };
  },

  render() {

    return (
      <path
        className="rd3-areachart-area"
        d={this.props.path}
        fill={this.props.fill}
      />
    );
  }

});
