'use strict';

var React = require('react');
var d3 = require('d3');

var Brush = React.createClass({
  propTypes: {
    updateExtentAction: React.PropTypes.func.isRequired,
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
      brushing: false,
      mouseStartX: 0,
      mouseStartY: 0,
      elX: 0,
      elY: 0,
      mouseX: 0,
      mouseY: 0
    }
  },

  render() {
    var extent = this._calculateScales()
    return <g
      className={(this.state.brushing && 'brushing') + ' brush'}
      onMouseDown={this._brushStart}
      onMouseMove={this._brush}
      onMouseUp={this._brushEnd}
      >
      <rect width={this.props.xScale.range()[1]} height={this.props.yScale.range()[0]} opacity={.00001}/>
      <rect
        x={extent.x[0]}
        y={extent.y[0]}
        width={extent.x[1] - extent.x[0]}
        height={extent.y[1] - extent.y[0]}
        fill={this.state.brushing ? this.props.brushingFill : this.props.fill}
        opacity={this.state.brushing ? this.props.brushingOpacity : this.props.opacity}
        />
      </g>
  },

  _brush (e) {
    if (!this.state.brushing) return
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  },

  _brushStart (e) {
    var elPos = this.getDOMNode().getBoundingClientRect()
    this.setState({
      brushing: true,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
      elX: elPos.left,
      elY: elPos.top,
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  },

  _brushEnd (e) {
    var clientX = e.clientX, clientY = e.clientY;
    this.setState({
      brushing: false,
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  },

  _calculateBox (payload) {
    return {x: [d3.min(payload.x), d3.max(payload.x)], y: [d3.min(payload.y), d3.max(payload.y)]}
  },

  _calculateScales () {
    return this._calculateBox({
      x: [
        this.state.mouseStartX - this.state.elX,
        this.state.mouseX - this.state.elX
      ],
      y: [
        this.state.mouseStartY - this.state.elY,
        this.state.mouseY - this.state.elY
      ]
    })
  }
})

exports.Brush = Brush;
