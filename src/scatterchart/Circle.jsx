'use strict';

var React = require('react');
var d3 = require('d3');
var utils = require('../utils');

module.exports = React.createClass({

  displayName: 'Circle',

  propTypes: {
    id: React.PropTypes.string,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    strokeOpacity: React.PropTypes.number,
    hoverAnimation: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fill: '#1f77b4',
      className: 'rd3-scatterchart-circle'
    };
  },

  getInitialState() {
    // state for animation usage
    return {
      circleRadius: this.props.r,
      circleFill: this.props.fill
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiRef.observe(() => {
      var circleStatus = props.voronoiRef.cursor().deref();
      if (circleStatus === 'active') {
        this._animateCircle(props.id);
      } else if (circleStatus === 'inactive') {
        this._restoreCircle(props.id);
      }
    });
  },

  componentWillUnmount() {
    this.props.voronoiRef.destroy();
  },

  render() {
    return (
      <circle
        fill={this.state.circleFill}
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.state.circleRadius}
        id={this.props.id}
        className={this.props.className}
      />
    );
  },

  _animateCircle(id) {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 ),
      circleFill: utils.shade(this.props.fill, -0.2)
    });
  },

  _restoreCircle(id) {
    this.setState({ 
      circleRadius: this.props.r,
      circleFill: this.props.fill
    });
  }

});
