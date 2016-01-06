'use strict';

var React = require('react');
var d3 = require('d3');
var BarContainer = require('./BarContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data:          React.PropTypes.array,
    series:   React.PropTypes.array,
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
    var barHeight = Math.abs(yScale(0) - yScale(segment.y));
    var y = yScale( segment.y0 + segment.y );
    return (
      <BarContainer
        height={barHeight}
        width={xScale.rangeBand()}
        x={xScale(segment.x)}
        y={(segment.y >= 0) ? y : y - barHeight}
        fill={colors(colorAccessor(segment, seriesIdx))}
        hoverAnimation={hoverAnimation}
        onMouseOver={this.props.onMouseOver}
        onMouseLeave={this.props.onMouseLeave}
        dataPoint={{xValue: segment.x, yValue: segment.y, seriesName: this.props.series[seriesIdx]}}
      />
    )
  }

});
