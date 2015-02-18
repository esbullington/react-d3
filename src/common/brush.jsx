'use strict';

var React = require('react');
var d3 = require('d3');

var Brush = React.createClass({
  propTypes: {
    fill: React.PropTypes.string,
    opacity: React.PropTypes.number,
    brushingFill: React.PropTypes.string,
    brushingOpacity: React.PropTypes.number,
    onBrush: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      fill: '#aaa',
      opacity: 0.2,
      brushingFill: '#777',
      brushingOpacity: 0.3
    }
  },

  getInitialState() {
    return {
      brushing: false
    }
  },

  // Create the brush when the component mounts
  componentDidMount() {
    this._bindBrush();
  },

  // Update styles using componentDidUpdate() rather than render(),
  // as it will cause an error on the first render call because the
  // component is not mounted as so does not have a DOM representation
  // for d3 to modify yet
  componentDidUpdate() {
    this._applyStyles();
  },

  componentWillReceiveProps(nextProps) {
    // Don't update the brush when brushing - it'll cancel the drag event
    if (!this.state.brushing) this._updateBrushScales(nextProps);
  },

  render() {
    return <g className={(this.state.brushing && 'brushing') + ' brush'}></g>
  },

  _applyStyles() {
    // Should include this for error checking
    // if (!this.getDOMNode()) {return}
    var g = d3.select(this.getDOMNode())

    g.select('.extent')
      .attr({
        fill: (this.state.brushing ? this.props.brushingFill : this.props.fill),
        opacity: (this.state.brushing ? this.props.brushingOpacity : this.props.opacity)
      })
  },

  _bindBrush() {
    // Create brush
    this.brush = d3.svg.brush()
      .x(this.props.xScale)
      .y(this.props.yScale)
      .on('brush', this.props.onBrush)
      .on('brushstart', this._brushStart)
      .on('brushend', this._brushEnd)

    // Append brush to DOM - can we do this with React?
    // Or handle everything with React?
    d3.select(this.getDOMNode())
      .call(this.brush)
  },

  _brushStart () {
    this.setState({
      brushing: true
    })
  },

  _brushEnd () {
    this.setState({
      brushing: false
    })
  },

  _updateBrushScales(props) {
    this.brush
      .x(props.xScale)
      .y(props.yScale)
  }
})

exports.Brush = Brush;
