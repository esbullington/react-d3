'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      stroke: '#3182bd',
      fill: 'none',
      strokeWidth: 1,
      className: 'rd3-linechart-path'
    };
  },

  render() {
    var props = this.props;
    return (
      <path
        d={props.path}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        fill={props.fill}
        className={props.className}
      />
    );
  }

});
