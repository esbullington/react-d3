'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'AxisTick',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    orient: React.PropTypes.oneOf(['top','bottom','left','right']).isRequired,
    orient2nd: React.PropTypes.oneOf(['top','bottom','left','right']),
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    tickArguments : React.PropTypes.array,
    tickValues: React.PropTypes.array,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickFormat: React.PropTypes.func,
    tickTimeFormat: React.PropTypes.string,        // https://github.com/mbostock/d3/wiki/Time-Formatting#format
    localizationConfig: React.PropTypes.object,    // https://github.com/mbostock/d3/wiki/Localization#locale
    tickStroke: React.PropTypes.string,
    gridHorizontal: React.PropTypes.bool,
    gridVertical: React.PropTypes.bool,
    gridHorizontalStroke: React.PropTypes.string,
    gridVerticalStroke: React.PropTypes.string,
    gridHorizontalStrokeWidth: React.PropTypes.number,
    gridVerticalStrokeWidth: React.PropTypes.number,
    gridHorizontalStrokeDash: React.PropTypes.string,
    gridVerticalStrokeDash: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickStroke: '#000',
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      gridHorizontal: false,
      gridVertical: false,
      gridHorizontalStroke: '#D8D7D7',
      gridVerticalStroke: '#D8D7D7',
      gridHorizontalStrokeWidth: 1,
      gridVerticalStrokeWidth: 1,
      gridHorizontalStrokeDash: '5, 5',
      gridVerticalStrokeDash: '5, 5',
      localizationConfig: {
        'decimal': '.',
        'thousands': ',',
        'grouping': [3],
        'currency': ['$', ''],
        'dateTime': '%a %b %e %X %Y',
        'date': '%m/%d/%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'shortDays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
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

    var gridStrokeWidth,
        gridStroke,
        gridStrokeDashArray,
        x2grid,
        y2grid;
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
    } else if (props.tickTimeFormat) {
      tickFormat = d3.locale(props.localizationConfig).timeFormat(props.tickTimeFormat);
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
        dy =  sign < 0 ? 0 : 0.71;
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'bottom':
        tr = (tick) => `translate(${adjustedScale(tick)},0)`;
        textAnchor = "middle";
        y2 = props.innerTickSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? 0 : .71;
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'left':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "end";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = .32;
        x2grid = props.width;
        y2grid = 0;
        break;
      case 'right':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "start";
        x2 = props.innerTickSize * -sign;
        x1 = tickSpacing * -sign;
        dy = .32;
        x2grid = -props.width;
        y2grid = 0;
        break;
    }

    if (props.gridHorizontal) {
      gridOn = true;
      gridStrokeWidth = props.gridHorizontalStrokeWidth;
      gridStroke = props.gridHorizontalStroke;
      gridStrokeDashArray = props.gridHorizontalStrokeDash;
    }
    else if (props.gridVertical) {
      gridOn = true;
      gridStrokeWidth = props.gridVerticalStrokeWidth;
      gridStroke = props.gridVerticalStroke;
      gridStrokeDashArray = props.gridVerticalStrokeDash;
    }

    // return grid line if grid is enabled and grid line is not on at same position as other axis.
    var gridLine = function(pos) {
      if (gridOn
        && !(props.orient2nd == 'left' && pos == 0)
        && !(props.orient2nd == 'right' && pos == props.width)
        && !((props.orient == 'left' || props.orient == 'right') && pos == props.height)
      ) {
        return (
          <line style={{
            strokeWidth: gridStrokeWidth,
            shapeRendering: 'crispEdges',
            stroke: gridStroke,
            strokeDasharray: gridStrokeDashArray
          }} x2={x2grid} y2={y2grid}></line>
        )
      }
    }

    return (
      <g>
        {ticks.map( (tick, idx) => {
          var tickTexts = tickFormat(tick).split('\\n');
          return (
            <g key={idx} className="tick" transform={tr(tick)} >
              {gridLine(adjustedScale(tick))}
              <line style={{shapeRendering:'crispEdges',opacity:'1',stroke:props.tickStroke}} x2={x2} y2={y2} >
              </line>
              {tickTexts.map((line, idx) =>{
                return <text
                  key={idx}
                  strokeWidth="0.01"
                  dy={(dy + (idx) * 0.9) + 'em'} x={x1} y={y1}
                  style={{stroke:props.tickTextStroke, fill:props.tickTextStroke}}
                  textAnchor={textAnchor}
                >
                  {line}
                </text>;
              })}
            </g>
          );
        })
        }
      </g>
    );
  }

});
