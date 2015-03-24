'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({
  getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null
    };
  },

  render() {
    var props = this.props;

    var tr,
        ticks,
        scale,
        adjustedScale,
        textAnchor,
        tickFormat,
        y1, y2, dy, x1, x2, dx;

    var sign = props.yScale ? -1 : 1;
    var tickSpacing = Math.max(props.innerTickSize, 0) + props.tickPadding;  

    scale = props.yScale ? props.yScale : props.xScale;

    ticks = props.tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, props.tickArguments) : scale.domain()) : props.tickValues;
    if (props.tickFormatting) {
        tickFormat = props.tickFormatting
    } else if (scale.tickFormat) {
        tickFormat = scale.tickFormat.apply(scale, props.tickArguments)
    } else {
        tickFormat = (d)=> d;

    }

    adjustedScale = scale.rangeBand ? (d) => { return scale(d) + scale.rangeBand() / 2; } : scale;

    // Still working on this
    // Ticks and lines are not fully aligned
    // in some orientations
    switch (props.orient) {
      case 'top':
        tr = (tick) => `translate(${adjustedScale(tick)},0)`;
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? "0em" : ".71em";
        break;
      case 'bottom':
        tr = (tick) => `translate(${adjustedScale(tick)},0)`;
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? "0em" : ".71em";
        break;
      case 'left':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "end";
        x2 = props.innerTickSize * sign;
        x1 = tickSpacing * sign;
        dy = ".32em";
        break;
      case 'right':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "end";
        x2 = props.innerTickSize;
        x1 = tickSpacing * sign;
        dy = ".32em";
        break;
    }

    return (
      <g>
        {ticks.map( (tick, i) => {
          return (
            <g key={i} className="tick" transform={tr(tick)} >
              <line style={{shapeRendering:'crispEdges',opacity:'1',stroke:'#000'}} x2={x2} y2={y2} >
              </line>
              <text
                strokeWidth="0.01"
                dy={dy} x={x1} y={y1}
                stroke='#000'
                textAnchor={textAnchor}
              >
                {tickFormat(tick)}
              </text>
            </g>
          );
          })
        }
      </g>
    );
  }

});
