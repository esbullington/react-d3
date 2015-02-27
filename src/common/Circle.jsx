'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    className: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4'
    };
  },

  getInitialState: function() {
    // state for animation usage
    return {
      circleRadius: this.props.r,
      circleColor: this.props.fill
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiRef.observe(() => {
      var circleStatus = props.voronoiRef.cursor().deref();
      var seriesName = props.id.split('-')[0];
      if (circleStatus === 'active') {
        this._animateCircle(props.id);
        var voronoiSeriesCursor = props.structure.cursor('voronoiSeries');
        if (voronoiSeriesCursor) {
          voronoiSeriesCursor.cursor(seriesName).update(()=>'active');
        }
      } else if (circleStatus === 'inactive') {
        this._restoreCircle(props.id);
        props.structure.cursor('voronoiSeries').cursor(seriesName).update(()=>'inactive');
      }
    });
  },

  componentWillUnmount: function() {
    this.props.voronoiRef.destroy();
  },

  render: function() {
    var props = this.props;
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={this.state.circleRadius}
        fill={this.state.circleColor}
        id={props.id}
        className={props.className}
      />
    );
  },
  
  _animateCircle: function(id) {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 )
    });
  },

  _restoreCircle: function(id) {
    this.setState({ 
      circleRadius: this.props.r
    });
  }

});
