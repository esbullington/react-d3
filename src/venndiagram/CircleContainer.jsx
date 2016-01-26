'use strict';

var React = require('react');
var Circle = require('./Circle');
var shade = require('../utils').shade;

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      fill: '#3182BD'
    };
  },

  getInitialState() {
    return {
      // fill is named as fill instead of initialFill to avoid
      // confusion when passing down props from top parent
      fill: this.props.fill,
      fillOpacity: this.props.fillOpacity,
    };
  },

  render() {

    var props = this.props;

    return (
      <Circle
        {...props}
        fill={this.state.fill}
        fillOpacity={this.state.fillOpacity}
        handleMouseOver={props.hoverAnimation ? this._animateCircle : null}
        handleMouseLeave={props.hoverAnimation ? this._restoreCircle : null}
      />
    );
  },

  _animateCircle() {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint )
    this.setState({ 
      fill: shade(this.props.fill, 0.2),
      fillOpacity: 1,
    });
  },

  _restoreCircle() {
    this.props.onMouseLeave.call(this);
    this.setState({ 
      fill: this.props.fill,
      fillOpacity: this.props.fillOpacity,
    });
  },
});
