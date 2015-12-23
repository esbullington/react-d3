'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'AxisTick',

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    orient: React.PropTypes.oneOf(['top','bottom','left','right']).isRequired,
    orient2nd: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
      // string is currently necessary until charts other than linechart will be updated
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    arg: React.PropTypes.arrayOf(React.PropTypes.number),
    format: React.PropTypes.func,
    innerSize: React.PropTypes.number,
    outerSize: React.PropTypes.number,
    padding: React.PropTypes.number,
    stroke: React.PropTypes.string,
    timeFormat: React.PropTypes.string,            // https://github.com/mbostock/d3/wiki/Time-Formatting#format
    values: React.PropTypes.array,
    localizationConfig: React.PropTypes.object,    // https://github.com/mbostock/d3/wiki/Localization#locale
    grid: React.PropTypes.shape({
      horizontal: React.PropTypes.bool,
      horizontalStroke: React.PropTypes.string,
      horizontalStrokeDash: React.PropTypes.string,
      horizontalStrokeWidth: React.PropTypes.number,
      vertical: React.PropTypes.bool,
      verticalStroke: React.PropTypes.string,
      verticalStrokeDash: React.PropTypes.string,
      verticalStrokeWidth: React.PropTypes.number
    }),
  },
  getDefaultProps() {
    return {
      arg: [10],
      innerSize: 6,
      outerSize: 6,
      padding: 3,
      stroke: '#000',
      values: null,
      grid: {
        horizontal: false,
        vertical: false
      },
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
    var tickSpacing = Math.max(props.innerSize, 0) + props.padding;

    scale = props.scale;

    if (props.values) {
      ticks = props.values;
    } else if (scale.ticks) {
      ticks = scale.ticks.apply(scale, props.arg);
    } else {
      ticks = scale.domain();
    }

    if (props.formatting) {
      tickFormat = props.formatting;
    } else if (props.timeFormat) {
      tickFormat = d3.locale(props.localizationConfig).timeFormat(props.timeFormat);
    } else if (scale.tickFormat) {
      tickFormat = scale.tickFormat.apply(scale, props.arg);
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
        y2 = props.innerSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? 0 : 0.71;
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'bottom':
        tr = (tick) => `translate(${adjustedScale(tick)},0)`;
        textAnchor = "middle";
        y2 = props.innerSize * sign;
        y1 = tickSpacing * sign;
        dy =  sign < 0 ? 0 : .71;
        x2grid = 0;
        y2grid = -props.height;
        break;
      case 'left':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "end";
        x2 = props.innerSize * -sign;
        x1 = tickSpacing * -sign;
        dy = .32;
        x2grid = props.width;
        y2grid = 0;
        break;
      case 'right':
        tr = (tick) => `translate(0,${adjustedScale(tick)})`;
        textAnchor = "start";
        x2 = props.innerSize * -sign;
        x1 = tickSpacing * -sign;
        dy = .32;
        x2grid = -props.width;
        y2grid = 0;
        break;
    }

    if (props.grid.horizontal && (props.orient === 'left')) {
      gridOn = true;
      gridStroke = props.grid.horizontalStroke || '#D8D7D7';
      gridStrokeDashArray = props.grid.horizontalStrokeDash || '5, 5';
      gridStrokeWidth = props.grid.horizontalStrokeWidth || 1;
    }
    else if (props.grid.vertical && (props.orient === 'bottom')) {
      gridOn = true;
      gridStroke = props.grid.verticalStroke || '#D8D7D7';
      gridStrokeDashArray = props.grid.verticalStrokeDash || '5, 5';
      gridStrokeWidth = props.grid.verticalStrokeWidth || 1;
    }

    // return grid line if grid is enabled and grid line is not on at same position as other axis.
    var gridLine = function(pos) {
      if (gridOn
        && !(props.orient2nd.includes('left') && pos == 0)
        && !(props.orient2nd.includes('right') && pos == props.width)
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
          var tickTexts = tickFormat(tick).toString().split('\\n');
          return (
            <g key={idx} className="tick" transform={tr(tick)} >
              {gridLine(adjustedScale(tick))}
              <line style={{shapeRendering:'crispEdges',opacity:'1',stroke:props.stroke}} x2={x2} y2={y2} >
              </line>
              {tickTexts.map((line, idx) =>{
                return <text
                  key={idx}
                  strokeWidth="0.01"
                  dy={(dy + (idx) * 0.9) + 'em'} x={x1} y={y1}
                  style={{stroke:props.textStroke, fill:props.textStroke}}
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
