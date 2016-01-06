'use strict';

var React = require('react');
var Bar = require('./Bar');
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
      fill: this.props.fill
    };
  },

  render() {

    var props = this.props;

    return (
      <Bar
        {...props}
        fill={this.state.fill}
        handleMouseOver={props.hoverAnimation ? this._animateBar : null}
        handleMouseLeave={props.hoverAnimation ? this._restoreBar : null}
      />
    );
  },

  _animateBar() {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint )
    this.setState({ 
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreBar() {
    this.props.onMouseLeave.call(this);
    this.setState({ 
      fill: this.props.fill
    });
  },
});
