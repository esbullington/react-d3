'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiContainer = require('../common/marker/VoronoiContainer');
var utils = require('../utils');
var Line = require('./Line');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    color: React.PropTypes.func,
    colorAccessor: React.PropTypes.func,
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      data: [],
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      interpolationType: 'linear',
      hoverAnimation: false
    };
  },

  _linkValues: utils.linkValues,
  _prepareValues: utils.prepareValues,

  render() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    //var xAccessor = props.xAccessor,
//        yAccessor = props.yAccessor;
    var marker = [];
    var self = this;

    var linkValues = self._linkValues;
    var prepareValues = (values,accessor) => { return self._prepareValues(props,values,accessor); };

    var interpolatePath = d3.svg.line()
      .x( (d) => d.xs = xScale(d.x) )
      .y( (d) => d.ys = yScale(d.y) )
      .interpolate(props.interpolationType)
      // only draw values inside x axis range and those next to it
      .defined( (d) => {
        var use = (d.x >= xScale.domain()[0] && d.x <= xScale.domain()[1]) ||
        (d.prevVal && d.prevVal.x >= xScale.domain()[0] && d.prevVal.x <= xScale.domain()[1]) ||
        (d.nextVal && d.nextVal.x >= xScale.domain()[0] && d.nextVal.x <= xScale.domain()[1]);
        d.use = use;
        return use;
      });

    var lines = props.data.map((series, idx) => {
      var valueSet = linkValues(prepareValues(series.values));
      var path = interpolatePath(valueSet);

      var exclude = [];
      var usedOverrides = [];
      var lines = [
      ];

      // Make an array markerName containing the name (form) of the marker for each data point
      var markerName = new Array(0);
      if (!Array.isArray(series.markerName)) {
        // use same marker for all data points
        var markerCount = series.values.length;
        while (markerCount--) {
          markerName.push(series.markerName);
        }
        // From ES6 on (not supported yet):
        // var markerName = new Array(this.props.values.length).fill(this.props.marker);
      }
      else {
        // use different markers for data points
        markerName = series.markerName.slice();
        if (markerName.length != series.values.length) {
          // less markers than data points defined. use last defined marker for data points with undefined marker
          var lastMarker = series.markerName[series.markerName.length - 1];
          var diff = series.values.length - markerName.length;
          while (diff > 0 && diff--) {
            markerName.push(lastMarker);
          }
        }
      }

      marker.push({
        markerName: markerName,                       // per data point
        markerWidth: series.markerWidth,              // same for one series
        markerHeight: series.markerHeight,            // same for one series
        markerRadius: series.markerRadius,            // same for one series
        markerOuterRadius: series.markerOuterRadius,  // same for one series
        markerInnerRadius: series.markerInnerRadius,  // same for one series
        markerAnimationResize: series.markerAnimationResize,  // same for one series
        markerAnimationShade: series.markerAnimationShade     // same for one series
        // markerFill:
        // - would be good to have that here too (is below now)
        // - same for one series
      });

      // Check for overridden line segments
      valueSet.forEach( (v) => {
        if (!v.use || !v.nextVal || !v.nextVal.use) return;
        var overrides = v.original.override;
        if (!overrides) return;
        if (!Array.isArray(overrides)) overrides = [overrides];
        var usedOverride = null;
        overrides.forEach( (override) => {
            var overrideSet = props.overrideSets[override];
            if (overrideSet && overrideSet.line) usedOverride = override
        });
        if (!usedOverride) return;
        exclude.push([v.xs,v.nextVal.xs]);
        v.override = usedOverride;
        if (usedOverrides.indexOf(usedOverride) < 0) usedOverrides.push(usedOverride)
      });

      // Add main line (no overrides); overridden segments (if any) are cut out
      lines.push(
        <Line
          path={path}
          stroke={series.stroke || props.colors(props.colorAccessor(series, idx))}
          strokeWidth={series.strokeWidth}
          strokeDashArray={series.strokeDashArray}
          seriesName={series.name}
          key={idx}
          override={'_main'}
          coverage={{ranges: exclude, invert: true}}
          height={props.height}
          width={props.width}
        />
      );

      // For each discovered override, create a new line, filling in the overridden parts
      usedOverrides.forEach((override) => {
        var include = [];
        var overrideSet = props.overrideSets[override];
        valueSet.forEach( (v) => {
          if (!v.use || !v.nextVal || !v.nextVal.use || v.override != override) return;
          include.push([v.xs, v.nextVal.xs])
        });
        lines.push(
          <Line
            path={path}
            stroke={overrideSet.stroke || series.stroke || props.colors(props.colorAccessor(series, idx))}
            strokeWidth={overrideSet.strokeWidth || series.strokeWidth}
            strokeDashArray={overrideSet.strokeDashArray || series.strokeDashArray}
            seriesName={series.name}
            key={idx+"."+override}
            override={override}
            coverage={{ranges: include, invert: false}}
            height={props.height}
            width={props.width}
            />
        )
      });

      return lines;
    });

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.x); })
      .y(function(d){ return yScale(d.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var dx, cx, dy, cy, markerFill;
    var regions = voronoi(prepareValues(props.value, (v) => v.coord )).map(function(vnode, idx) {
      var point = vnode.point.coord;
      dx = vnode.point.x;
      if (dx < xScale.domain()[0] || dx > xScale.domain()[1]) return null;
      cx = props.xScale(dx);
      dy = vnode.point.y;
      if (dy < yScale.domain()[0] || dy > yScale.domain()[1]) return null;  
      cy = props.yScale(dy);
      markerFill = props.colors(props.colorAccessor(vnode, vnode.point.original.seriesIndex));

      return (
        <VoronoiContainer
          key={idx}
          vnode={vnode}
          cx={cx} cy={cy}
          point={point}
          chartType={'linechart'}
          hoverAnimation={props.hoverAnimation}
          markerName={marker[vnode.point.original.seriesIndex].markerName.shift()}
          markerFill={markerFill}
          markerWidth={marker[vnode.point.original.seriesIndex].markerWidth}
          markerHeight={marker[vnode.point.original.seriesIndex].markerHeight}
          markerRadius={marker[vnode.point.original.seriesIndex].markerRadius}
          markerOuterRadius={marker[vnode.point.original.seriesIndex].markerOuterRadius}
          markerInnerRadius={marker[vnode.point.original.seriesIndex].markerInnerRadius}
          markerAnimationResize={marker[vnode.point.original.seriesIndex].markerAnimationResize}
          markerAnimationShade={marker[vnode.point.original.seriesIndex].markerAnimationShade}
          markerOnClick={props.markerOnClick}
        />
      );
    }.bind(this));

    return (
      <g>
        <g>{lines}</g>
        <g>{regions}</g>
      </g>
    );
  }

});
