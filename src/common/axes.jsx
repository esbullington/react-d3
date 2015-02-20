'use strict';

var React = require('react');
var d3 = require('d3');

// Implementation of AxisTicks and AxisLine 
// derived from d3's axis.js
// copyright Mike Bostock 2010-2015
// need to add LICENSE from d3

var AxisTicks = React.createClass({

  getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      d3_identity: (d)=>d,
      tickFormat: null
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

    // We can use this along with sign 
    // if we want to remove the hardcoded y, y2, x, x2, etc below
    var tickSpacing = Math.max(props.innerTickSize, 0) + props.tickPadding;  

    scale = props.yScale ? props.yScale : props.xScale;

    var ticks = props.tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, props.tickArguments) : scale.domain()) : props.tickValues;
    var tickFormat = props.tickFormat_ == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, props.tickArguments) : props.d3_identity) : props.tickFormat_;

    adjustedScale = scale.rangeBand ? (d) => { return scale(d) + scale.rangeBand() / 2; } : scale;

    if (props.xScale) {
      tr = (tick) => `translate(${adjustedScale(tick)},0)`;
      textAnchor = "middle";
      y2 = props.innerTickSize * sign;
      y1 = tickSpacing * sign;
      dy =  sign < 0 ? "0em" : ".71em";
    } else if (props.yScale) {
      tr = (tick) => `translate(0,${adjustedScale(tick)})`;
      textAnchor = "end"
      x2 = props.innerTickSize * sign;
      x1 = tickSpacing * sign;
      dy = ".32em";
    }


    return (
      <g>
        {ticks.map( (tick, i) => {
          return  <g key={i} className="tick" transform={tr(tick)} >
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
          })
        }
      </g>
    );
  }

});

var AxisLine = React.createClass({

  propTypes: {
    scale: React.PropTypes.func.isRequired,
    innerTickSize: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    tickArguments: React.PropTypes.array,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      innerTickSize: 6,
      outerTickSize: 6,
      tickPadding: 3,
      tickArguments: [10],
      tickValues: null,
      tickFormat: null 
    };
  },


  _d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },

  _d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
  },

  render() {

    var props = this.props;
    var sign = props.orient === "top" || props.orient === "left" ? -1 : 1;

    var range = this._d3_scaleRange(props.scale);

    var d;

    if (props.orient === "bottom" || props.orient === "top") {
      d = "M" + range[0] + "," + sign * props.outerTickSize + "V0H" + range[1] + "V" + sign * props.outerTickSize;
    } else {
      d = "M" + sign * props.outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * props.outerTickSize;
    }


    return (
      <path
        className="domain"
        d={d}
        style={{'shapeRendering':'crispEdges'}}
        fill="none"
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
      >
      </path>
    );
  }
});

exports.XAxis = React.createClass({

  propTypes: {
    xAxisClassName: React.PropTypes.string.isRequired,
    xOrient: React.PropTypes.oneOf(['top', 'bottom']),
    xScale: React.PropTypes.func.isRequired,
    xHideOrigin: React.PropTypes.bool,
    height: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    xAxisOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      xAxisClassName: 'x axis',
      xOrient: 'bottom',
      xHideOrigin: false,
      fill: "none",
      stroke: "none",
      tickStroke: "#000",
      strokeWidth: "none",
      hideOrigin: false,
      xAxisOffset: 0
    };
  },

  render: function() {
    var props = this.props;

    var t = `translate(0,${props.xAxisOffset + props.height})`;

    var tickArguments;
    if (typeof props.xAxisTickCount !== 'undefined') {
      tickArguments = [props.xAxisTickCount];
    }
    
    if (typeof props.xAxisTickInterval !== 'undefined') {
      tickArguments = [d3.time[props.xAxisTickInterval.unit], props.xAxisTickInterval.interval];
    }

    return (
      <g
        className={props.xAxisClassName}
        transform={t}
      >
        <AxisTicks
          tickArguments={tickArguments}
          xScale={props.xScale}
        />
        <AxisLine
          scale={props.xScale}
          orient={props.xOrient}
          {...props}
        />
      </g>
    );
  }

});


exports.YAxis = React.createClass({

  propTypes: {
    yAxisClassName: React.PropTypes.string,
    yOrient: React.PropTypes.oneOf(['left', 'right']),
    yScale: React.PropTypes.func.isRequired,
    yHideOrigin: React.PropTypes.bool,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string,
    tickStroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    yAxisOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      yAxisClassName: 'y axis',
      yOrient: 'left',
      yHideOrigin: false,
      fill: "none",
      stroke: "#000",
      tickStroke: "#000",
      strokeWidth: "1",
      yAxisOffset: 0
    };
  },

  render: function() {

    var props = this.props;

    var t = `translate(${props.yAxisOffset},0)`;

    var tickArguments;
    if (props.yAxisTickCount) {
      tickArguments = [props.yAxisTickCount];
    }
    
    if (props.yAxisTickInterval) {
      tickArguments = [d3.time[props.yAxisTickInterval.unit], props.yAxisTickInterval.interval];
    }

    return (
      <g
        className={props.yAxisClassName}
        transform={t}
      >
        <AxisTicks
          tickArguments={tickArguments}
          yScale={props.yScale}
        />
        <AxisLine
          scale={props.yScale}
          orient={props.yOrient}
          {...props}
        />
      </g>
    );
  }

});
