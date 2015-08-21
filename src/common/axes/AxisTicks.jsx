'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'AxisTick',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    orient: React.PropTypes.oneOf(['top','bottom','left','right']).isRequired,
    tickArguments : React.PropTypes.array,
    tickValues: React.PropTypes.array,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickFormat: React.PropTypes.func,
    tickStroke: React.PropTypes.string,
    gridHorizontal: React.PropTypes.bool,
    gridVertical: React.PropTypes.bool,
    gridHorizontalStroke: React.PropTypes.string,
    gridVerticalStroke: React.PropTypes.string,
    gridHorizontalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeWidth: React.PropTypes.number
  },
  getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickStroke: '#000',
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      gridHorizontal: true,
      gridVertical: false,
      gridHorizontalStroke: '#ADA8A8',
      gridVerticalStroke: '#ADA8A8',
      gridHorizontalStrokeWidth: 1,
      gridVerticalStrokeWidth: 1
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
        y0, y1, y2, dy, x0, x1, x2, dx;

    var gridHorizontal = false;
    var gridVertical = false;
    var gridStrokeWidth = 1;
    var gridStroke = '#ADA8A8';
    var x2grid, y2grid;
    var gridOn = false;

    var sign = props.orient === 'top' || props.orient === 'right' ? -1 : 1;
    var tickSpacing = Math.max(props.innerTickSize, 0) + props.tickPadding;

    scale = props.scale;

    if (props.tickValues) {
      ticks = props.tickValues;
    } else if (scale.ticks) {
      ticks = scale.ticks.apply(scale, props.tickArguments);
    } else {
      ticks = scale.domain();
    }

    if (props.tickFormatting) {
        tickFormat = props.tickFormatting;
    } else if (scale.tickFormat) {
        tickFormat = scale.tickFormat.apply(scale, props.tickArguments);
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
        gridVertical = props.gridVertical;
        x2grid = 0;
        y2grid = props.height;
        break;
      case 'bottom':
        tr = (tick) => `translate(${adjustedScale(tick)},0)`;
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? "0em" : ".71em";
        gridVertical = props.gridVertical;
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'left':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "end";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = ".32em";
        gridHorizontal = props.gridHorizontal;
        x2grid = props.width;
        y2grid = 0;
        break;
      case 'right':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "start";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = ".32em";
        gridHorizontal = props.gridHorizontal;
        x2grid = props.width;
        y2grid = 0;
        break;
    }

    if (gridHorizontal) {
      gridOn = true;
      gridStrokeWidth = props.gridHorizontalStrokeWidth;
      gridStroke = props.gridHorizontalStroke;
    }
    else if (gridVertical) {
      gridOn = true;
      gridStrokeWidth = props.gridVerticalStrokeWidth;
      gridStroke = props.gridVerticalStroke;
    }

    var gridLine = function(gridOn) {
      if (gridOn) {
        return (
          <line style={{
            strokeWidth: gridStrokeWidth,
            shapeRendering: 'crispEdges',
            stroke: gridStroke
            }} x2={x2grid} y2={y2grid}></line>
        )
      }
    }

    return (
    <g>
      {ticks.map( (tick, idx) => {
        return (
          <g key={idx} className="tick" transform={tr(tick)} >

            { /* plot grid line if it gird enabled and grid line is not on top of an axis */ }
            {gridLine(
                gridOn
                && !((props.orient == 'bottom' || props.orient == 'top') && adjustedScale(tick) == 0)
                && !((props.orient == 'left' || props.orient == 'right') && adjustedScale(tick) == props.height)
            )}
            <line style={{shapeRendering:'crispEdges',opacity:'1',stroke:props.tickStroke}} x2={x2} y2={y2} >
            </line>
            <text
              strokeWidth="0.01"
              dy={dy} x={x1} y={y1}
              style={{stroke:props.tickTextStroke, fill:props.tickTextStroke}}
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
