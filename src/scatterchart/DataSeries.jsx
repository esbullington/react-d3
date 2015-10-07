'use strict';

var React = require('react');
var d3 = require('d3');
var VoronoiCircleContainer = require('./VoronoiCircleContainer');
var utils = require('../utils');

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

  _prepareValues: utils.prepareValues,

  render: function() {
    var props     = this.props;
    var xScale    = props.xScale;
    var yScale    = props.yScale;
    var xAccessor = props.xAccessor;
    var yAccessor = props.yAccessor;
    var self = this;

    var prepareValues = (values,accessor) => { return self._prepareValues(props,values,accessor); }

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.x); })
      .y(function(d){ return yScale(d.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var regions = voronoi(prepareValues(props.values, (v) => v.coord)).map(function(vnode, idx) {
      var dx = vnode.point.x
      var cx = xScale(dx);
      if (dx < xScale.domain()[0] || dx > xScale.domain()[1]) return null;
      var dy = vnode.point.y
      var cy = yScale(dy);
      if (dy < yScale.domain()[0] || dy > yScale.domain()[1]) return null;

      return (
        <VoronoiCircleContainer
          key={idx}
          circleFill={props.colors(props.colorAccessor(vnode.point.original.d, vnode.point.original.seriesIndex))}
          circleRadius={props.circleRadius}
          cx={cx}
          cy={cy}
          vnode={vnode}
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
