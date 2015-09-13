'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiContainer = require('../common/marker/VoronoiContainer');
var generateMarker = require('../utils').generateMarker;

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

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.coord.x); })
      .y(function(d){ return yScale(d.coord.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var marker = props.data.map((series, idx) => {
      return generateMarker(series);
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
          markerAnimationResize={marker[vnode.point.seriesIndex].markerAnimationResize}
          markerAnimationShade={marker[vnode.point.seriesIndex].markerAnimationShade}
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
