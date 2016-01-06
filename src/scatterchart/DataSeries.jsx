'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircleContainer = require('./VoronoiCircleContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    circleRadius:  React.PropTypes.number.isRequired,
    className:     React.PropTypes.string,
    colors:        React.PropTypes.func.isRequired,
    colorAccessor: React.PropTypes.func.isRequired,
    data:          React.PropTypes.array.isRequired,
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

    var regions = voronoi(props.data).map(function(vnode, idx) {
      var point = vnode.point;
      var coord = point.coord;

      var x = xAccessor(coord);
      var y = yAccessor(coord);

      // The circle coordinates
      var cx, cy;

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

      return (
        <VoronoiCircleContainer
          key={idx}
          circleFill={props.colors(props.colorAccessor(point.d, point.seriesIndex))}
          circleRadius={props.circleRadius}
          cx={cx}
          cy={cy}
          vnode={vnode}
          onMouseOver={props.onMouseOver}
          dataPoint={{xValue: x, yValue: y, seriesName: point.series.name}}
        />
      );
    });

    return (
      <g
        className={props.className}
      >
        {regions}
      </g>
    );
  }

});
