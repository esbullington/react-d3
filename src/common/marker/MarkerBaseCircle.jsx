/**
 * MarkerBaseCircle.jsx
 *
 * A marker base to underlay a marker with a circular background shape.
 */
'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'MarkerBaseCircle',

  render() {
    return (
      <circle
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.props.r}
        fill={this.props.fill}
        className={"rd3-" + this.props.chartType + "-baseCircle"}
      />
    );
  }
});
