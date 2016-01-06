'use strict';

var React = require('react');
var shade = require('../utils').shade;
var Arc = require('./Arc');

module.exports = React.createClass({

  displayName: 'ArcContainer',

  propTypes: {
    fill: React.PropTypes.string
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
      <Arc 
        {...this.props}
        fill={this.state.fill}
        handleMouseOver={props.hoverAnimation ? this._animateArc : null}
        handleMouseLeave={props.hoverAnimation ? this._restoreArc : null}
      />
    );
  },

  _animateArc() {
    var rect = this.getDOMNode().getBoundingClientRect();
    this.props.onMouseOver.call(this, rect.right, rect.top, this.props.dataPoint )
    this.setState({
      fill: shade(this.props.fill, 0.2)
    });
  },

  _restoreArc() {
    this.props.onMouseLeave.call(this);
    this.setState({
      fill: this.props.fill
    });
  }
});
