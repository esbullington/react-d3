'use strict';

var React = require('react');
var d3 = require('d3');
var BarContainer = require('./BarContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data:          React.PropTypes.array,
    colors:         React.PropTypes.func,
    colorAccessor:  React.PropTypes.func,
    height:         React.PropTypes.number,
    width:          React.PropTypes.number,
    valuesAccessor: React.PropTypes.func,
  },

  render() {
    return (
      <g>{this._renderBarSeries()}</g>
    );
  },

  _renderBarSeries() {
    var { _data, valuesAccessor } = this.props;
    return _data.map((layer, seriesIdx) => {
      return valuesAccessor(layer)
             .map(segment => this._renderBarContainer(segment, seriesIdx))
    });
  },

  _renderBarContainer(segment, seriesIdx) {
    var { colors, colorAccessor, height, hoverAnimation, xScale, yScale } = this.props;
    return (
      <BarContainer
        height={height - yScale(segment.y)}
        width={xScale.rangeBand()}
        x={xScale(segment.x)}
        y={yScale( segment.y0 + segment.y )}
        fill={colors(colorAccessor(segment, seriesIdx))}
        hoverAnimation={hoverAnimation}
      />
    )
  }

});
