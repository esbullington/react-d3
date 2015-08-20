'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiContainer = require('./VoronoiContainer');
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
      interpolationType: 'linear'
    };
  },
  
  _isDate(d, accessor) {
      return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;
    var marker = new Array();

    var interpolatePath = d3.svg.line()
      .y( (d) => props.yScale(yAccessor(d)) )
      .interpolate(props.interpolationType);

      if (this._isDate(props.data[0].values[0], xAccessor)) {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d).getTime());
        });
      } else {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d));
        });
      }

    var lines = props.data.map((series, idx) => {

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
        markerInnerRadius: series.markerInnerRadius   // same for one series
        // markerFill:
        // - would be good to have that here too (is below now)
        // - same for one series
      });

      return (
        <Line 
          path={interpolatePath(series.values)}
          stroke={props.colors(props.colorAccessor(series, idx))}
          strokeWidth={series.strokeWidth}
          strokeDashArray={series.strokeDashArray}
          seriesName={series.name}
          key={idx}
        />
      );
    });

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.coord.x); })
      .y(function(d){ return yScale(d.coord.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var cx, cy, markerFill;
    var regions = voronoi(props.value).map(function(vnode, idx) {
      var point = vnode.point.coord;
      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = props.xScale(xAccessor(point).getTime());
      } else {
        cx = props.xScale(xAccessor(point));
      }
      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = props.yScale(yAccessor(point).getTime());
      } else {
        cy = props.yScale(yAccessor(point));
      }
      markerFill = props.colors(props.colorAccessor(vnode, vnode.point.seriesIndex));

      return (
        <VoronoiContainer
          key={idx}
          vnode={vnode}
          cx={cx} cy={cy}
          markerName={marker[vnode.point.seriesIndex].markerName.shift()}
            // assigns wrong if more than one series share a data point
          markerFill={markerFill}
          markerWidth={marker[vnode.point.seriesIndex].markerWidth}
          markerHeight={marker[vnode.point.seriesIndex].markerHeight}
          markerRadius={marker[vnode.point.seriesIndex].markerRadius}
          markerOuterRadius={marker[vnode.point.seriesIndex].markerOuterRadius}
          markerInnerRadius={marker[vnode.point.seriesIndex].markerInnerRadius}
        />
      );
    }.bind(this));

    return (
      <g>
        <g>{regions}</g>
        <g>{lines}</g>
      </g>
    );
  }

});
