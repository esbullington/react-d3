'use strict';

var React = require('react');
var d3 = require('d3');
var AxisTicks = require('./AxisTicks');
var AxisLine = require('./AxisLine');
var Label = require('./Label');

module.exports = React.createClass({

  displayName: 'Axis',

  propTypes: {
    type:         React.PropTypes.oneOf(['x', 'y']).isRequired,
    className:    React.PropTypes.string,        // at top level equal to this.props.xAxis.className
    fill:         React.PropTypes.string,        // at top level equal to this.props.xAxis.*
    grid:         React.PropTypes.object,        // at top level equal to this.props.xAxis.*
    offset:       React.PropTypes.number,        // at top level equal to this.props.xAxis.*
    stroke:       React.PropTypes.string,        // at top level equal to this.props.xAxis.*
    strokeWidth:  React.PropTypes.number,        // at top level equal to this.props.xAxis.*
    ticks:        React.PropTypes.object,        // at top level equal to this.props.xAxis.*
    height:       React.PropTypes.number.isRequired,
    width:        React.PropTypes.number.isRequired,
    localizationConfig: React.PropTypes.object,
    xOrient:      React.PropTypes.oneOf(['top', 'bottom']),
    scale:       React.PropTypes.func.isRequired,
    //yOrient:      React.PropTypes.array
    yOrient:      React.PropTypes.oneOf(['left', 'right']),
  },

  getDefaultProps() {
    return {
      fill: 'none',
      stroke: '#000',
      strokeWidth: 1,
      offset: 0,
      ticks: {},
      xOrient: 'bottom',
      yOrient: 'left'
    };
  },

  render() {

    var props = this.props;
    var ticks = this.props.ticks;
    var orient, orient2nd, t;

    if (typeof ticks.count !== 'undefined') {
      ticks.arg = [ticks.count];
    }
    if (ticks.intervall) {
      ticks.arg = [d3.time[ticks.unit], ticks.interval];
    }

    if (props.type === 'x') {
      // it's an X axis
      orient = props.xOrient;
      orient2nd = [props.yOrient];
      t = `translate(0 ,${props.offset + props.height})`;
      props.className = props.className || 'rd3-x-axis';
    } else {
      // it's a Y axis
      orient = props.yOrient;
      orient2nd = props.xOrient;
      props.className = props.className || 'rd3-y-axis';
      if (props.yOrient === 'right') {
        t = `translate(${props.offset + props.width}, 0)`;
      } else {
        t = `translate(${props.offset}, 0)`;
      }
    }

    return (
      <g
        className={props.className}
        transform={t}
      >
        <AxisTicks
          {... ticks}
          grid={props.grid}
          scale={props.scale}
          orient={orient}
          orient2nd={[orient2nd]}
          height={props.height}
          width={props.width}
        />
        <AxisLine
          fill={props.fill}
          innerTickSize={ticks.innerSize}
          orient={orient}
          outerTickSize={ticks.outerSize}
          scale={props.scale}
          stroke={props.stroke}
          tickPadding={ticks.padding}
        />
        <Label
          label={props.label}
          offset={props.labelOffset}
          orient={orient}
          margins={props.margins}
          width={props.width}
          height={props.height}
          fill={props.labelStroke}
          strokeWidth={props.strokeWidth}
          textAnchor={props.textAnchor}
        />
      </g>
    );
  }

});
