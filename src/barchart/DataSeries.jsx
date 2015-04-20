'use strict';

var React = require('react');
var d3 = require('d3');
var Bar = require('./Bar');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    values: React.PropTypes.array,
    labels: React.PropTypes.array,
    fill: React.PropTypes.string,
    title: React.PropTypes.string,
    padding: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    offset: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      padding: 0.1,
      data: []
    };
  },

  render() {

    var props = this.props;

    var xScale = d3.scale.ordinal()
      .domain(d3.range(props.values.length))
      .rangeRoundBands([0, props.width], props.padding);

    var bars = props.values.map(function(point, idx) {
      return (
        <Bar
          height={props.yScale(0) - props.yScale(point)}
          width={xScale.rangeBand()}
          x={xScale(idx)}
          y={props.yScale(Math.max(0, point))}
          availableHeight={props.height}
          fill={props.fill}
          key={idx}
        />
      );
    });

    return (
      <g>{bars}</g>
    );
  }
});
