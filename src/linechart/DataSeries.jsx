'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircleContainer = require('./VoronoiCircleContainer');
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
    hoverAnimation: React.PropTypes.bool
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

      // Check for highlighted line segments
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

    var dx, cx, dy, cy, circleFill;
    var regions = voronoi(prepareValues(props.value, (v) => v.coord )).map(function(vnode, idx) {
      dx = vnode.point.x;
      if (dx < xScale.domain()[0] || dx > xScale.domain()[1]) return null;
      cx = props.xScale(dx);
      dy = vnode.point.y;
      if (dy < yScale.domain()[0] || dy > yScale.domain()[1]) return null;
      cy = props.yScale(dy);
      circleFill = props.colors(props.colorAccessor(vnode, vnode.point.seriesIndex));

      return (
          <VoronoiCircleContainer 
              key={idx} 
              circleFill={circleFill}
              vnode={vnode}
              hoverAnimation={props.hoverAnimation}
              cx={cx} cy={cy} 
              circleRadius={props.circleRadius}
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
