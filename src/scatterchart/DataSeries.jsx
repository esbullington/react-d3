'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiContainer = require('../common/marker/VoronoiContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    colors:        React.PropTypes.func.isRequired,
    colorAccessor: React.PropTypes.func.isRequired,
    value:          React.PropTypes.array.isRequired,
    height:        React.PropTypes.number.isRequired,
    xAccessor:     React.PropTypes.func.isRequired,
    xScale:        React.PropTypes.func.isRequired,
    yAccessor:     React.PropTypes.func.isRequired,
    yScale:        React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      className: 'rd3-scatterchart-dataseries'
    };
  },

  render: function() {
    var props     = this.props;
    var xScale    = props.xScale;
    var yScale    = props.yScale;
    var xAccessor = props.xAccessor;
    var yAccessor = props.yAccessor;
    var marker = new Array();

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.coord.x); })
      .y(function(d){ return yScale(d.coord.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    props.data.map((series, idx) => {
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
    });

    var regions = voronoi(props.value).map(function(vnode, idx) {
      var point = vnode.point;
      var coord = point.coord;

      var x = xAccessor(coord);
      var y = yAccessor(coord);

      // The circle coordinates and color
      var cx, cy, markerFill;

      if (Object.prototype.toString.call(x) === '[object Date]') {
        cx = xScale(x.getTime());
      } else {
        cx = xScale(x);
      }

      if (Object.prototype.toString.call(y) === '[object Date]') {
        cy = yScale(y.getTime());
      } else {
        cy = yScale(y);
      }
      markerFill = props.colors(props.colorAccessor(vnode, vnode.point.seriesIndex));

      return (
        <VoronoiContainer
          key={idx}
          vnode={vnode}
          cx={cx} cy={cy}
          point={point.coord}
          chartType={'scatterchart'}
          hoverAnimation={props.hoverAnimation}
          markerName={marker[vnode.point.seriesIndex].markerName.shift()}
          // assigns wrong if more than one series share a data point
          markerFill={markerFill}
          markerWidth={marker[vnode.point.seriesIndex].markerWidth}
          markerHeight={marker[vnode.point.seriesIndex].markerHeight}
          markerRadius={marker[vnode.point.seriesIndex].markerRadius}
          markerOuterRadius={marker[vnode.point.seriesIndex].markerOuterRadius}
          markerInnerRadius={marker[vnode.point.seriesIndex].markerInnerRadius}
          markerOnClick={props.markerOnClick}
          />
      );
    }.bind(this));

    return (
      <g
        className={props.className}
      >
        {regions}
      </g>
    );
  }

});
