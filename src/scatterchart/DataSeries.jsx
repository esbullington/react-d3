'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircleContainer = require('./VoronoiCircleContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    circleRadius:  React.PropTypes.number.isRequired,
    colors:        React.propTypes.func.isRequired,
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
      data: []
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
      var point = vnode.point.coord;
      var cx, cy;

      if (Object.prototype.toString.call(xAccessor(point)) === '[object Date]') {
        cx = xScale(xAccessor(point).getTime());
      } else {
        cx = xScale(xAccessor(point));
      }

      if (Object.prototype.toString.call(yAccessor(point)) === '[object Date]') {
        cy = yScale(yAccessor(point).getTime());
      } else {
        cy = yScale(yAccessor(point));
      }

      return (
        <VoronoiCircleContainer
          key={idx}
          circleFill={props.colors(props.colorAccessor(vnode.point.d, idx))}
          circleRadius={props.circleRadius}
          cx={cx}
          cy={cy}
          vnode={vnode}
        />
      );
    });

    return (
      <g>
        {regions}
      </g>
    );
  }

});
