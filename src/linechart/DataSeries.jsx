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

    var markerArray = new Array(0);
    if (!Array.isArray(this.props.marker)) {
      // use same marker for all data points
      var markerCount = this.props.value.length;
      var markerArray = new Array(0);
      while (markerCount--) {
        markerArray.push(this.props.marker);
      }
      // From ES6 on (not supported yet):
      // var markerArray = new Array(this.props.value.length).fill(this.props.marker);
    }
    else {
      // use different markers for data points
      markerArray = this.props.marker.slice();
      if (markerArray.length != this.props.value.length) {
        // less markers than data points defined. use last defined marker for data points with undefined marker
        var lastMarker = this.props.marker[this.props.marker.length - 1];
        var diff = this.props.value.length - markerArray.length;
        while (diff-- && diff > 0) {
          markerArray.push(lastMarker);
        }
      }
    }

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
          marker={markerArray[idx]}
          key={idx}
          markerFill={markerFill}
          vnode={vnode}
          cx={cx} cy={cy}
          markerWidth={props.markerWidth}
          markerHeight={props.markerHeight}
          markerRadius={props.markerRadius}
          markerOuterRadius={props.markerOuterRadius}
          markerInnerRadius={props.markerInnerRadius}
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
