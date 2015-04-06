'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    data: React.PropTypes.object,
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      stroke: '#1f77b4',
      strokeWidth: 1.5,
      fill: 'none',
      className: 'rd3-linechart-path'
    };
  },

  getInitialState() {
    // state for animation usage
    return {
      lineStrokeWidth: this.props.strokeWidth,
      lineStroke: this.props.stroke
    };
  },

  componentDidMount() {
    var props = this.props;
    // The circle reference is observed when both it is set to
    // active, and to inactive, so we have to check which one
    var unobserve = props.voronoiSeriesRef.observe(() => {
      var lineStatus = props.voronoiSeriesRef.cursor().deref();
      if (lineStatus === 'active') {
        this._animateLine(props.id);
      } else if (lineStatus === 'inactive') {
        this._restoreLine(props.id);
      }
    });
  },

  componentWillUnmount() {
    this.props.voronoiSeriesRef.destroy();
  },

  _animateLine(id) {
    this.setState({ 
      lineStrokeWidth: this.state.lineStrokeWidth * 1.8
    });
  },

  _restoreLine(id) {
    this.setState({ 
      lineStrokeWidth: this.props.strokeWidth
    });
  },

  render() {
    var props = this.props;
    var state = this.state;
    return (
      <path
        d={props.path}
        stroke={state.lineStroke}
        strokeWidth={state.lineStrokeWidth}
        fill={props.fill}
        className={props.className}
      />
    );
  }

});
