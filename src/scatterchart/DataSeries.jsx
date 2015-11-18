'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiContainer = require('../common/marker/VoronoiContainer');
var utils = require('../utils');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    colors:        React.PropTypes.func.isRequired,
    colorAccessor: React.PropTypes.func.isRequired,
    values:          React.PropTypes.array.isRequired,
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

  _prepareValues: utils.prepareValues,

  render: function() {
    var props     = this.props;
    var xScale    = props.xScale;
    var yScale    = props.yScale;
    var xAccessor = props.xAccessor;
    var yAccessor = props.yAccessor;
    var marker = new Array();
    var self = this;

    var prepareValues = (values,accessor) => { return self._prepareValues(props,values,accessor); };

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.x); })
      .y(function(d){ return yScale(d.y); })
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
      } else {
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
        markerUSD: series.markerUSD,  // same for one series
        markerAnimationResize: series.markerAnimationResize,  // same for one series
        markerAnimationShade: series.markerAnimationShade,     // same for one series
        markerFill: series.markerFill                 // might be the same for one series, if not defined, it'll be set
                                                      // later
      });
    });
      
    var regions = voronoi(prepareValues(props.values, (v) => v.coord)).map(function(vnode, idx) {
      var dx = vnode.point.x;
      var cx = xScale(dx);
      if (dx < xScale.domain()[0] || dx > xScale.domain()[1]) return null;
      var dy = vnode.point.y;
      var cy = yScale(dy);
      if (dy < yScale.domain()[0] || dy > yScale.domain()[1]) return null;
      var markerFill = marker[vnode.point.original.seriesIndex].markerFill ||
          props.colors(props.colorAccessor(vnode, vnode.point.original.seriesIndex));

      return (
        <VoronoiContainer
          key={idx}
          vnode={vnode}
          cx={cx} cy={cy}
          point={vnode.point.original.coord}
          chartType={'scatterchart'}
          hoverAnimation={props.hoverAnimation}
          markerName={marker[vnode.point.original.seriesIndex].markerName.shift()}
          // assigns wrong if more than one series share a data point
          markerFill={markerFill}
          markerWidth={marker[vnode.point.original.seriesIndex].markerWidth}
          markerHeight={marker[vnode.point.original.seriesIndex].markerHeight}
          markerRadius={marker[vnode.point.original.seriesIndex].markerRadius}
          markerOuterRadius={marker[vnode.point.original.seriesIndex].markerOuterRadius}
          markerInnerRadius={marker[vnode.point.original.seriesIndex].markerInnerRadius}
          markerUSD={marker[vnode.point.original.seriesIndex].markerUSD}
          markerAnimationResize={marker[vnode.point.original.seriesIndex].markerAnimationResize}
          markerAnimationShade={marker[vnode.point.original.seriesIndex].markerAnimationShade}
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
