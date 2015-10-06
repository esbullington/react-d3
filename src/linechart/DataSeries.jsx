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
    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;
    var self = this;

    var linkValues = self._linkValues;
    var prepareValues = (values,accessor) => { return self._prepareValues(props,values,accessor); }

    var interpolatePath = d3.svg.line()
        .x( (d) => xScale(d.x) )
        .y( (d) => yScale(d.y) )
        .interpolate(props.interpolationType)
        // only draw values inside x axis range and those next to it
        .defined( (d) => (d.x >= xScale.domain()[0] && d.x <= xScale.domain()[1]) ||
                         (d.prevVal && d.prevVal.x >= xScale.domain()[0] && d.prevVal.x <= xScale.domain()[1]) ||
                         (d.nextVal && d.nextVal.x >= xScale.domain()[0] && d.nextVal.x <= xScale.domain()[1]));

    var lines = props.data.map((series, idx) => {
      return (
        <Line 
          path={interpolatePath(linkValues(prepareValues(series.values)))}
          stroke={props.colors(props.colorAccessor(series, idx))}
          strokeWidth={series.strokeWidth}
          strokeDashArray={series.strokeDashArray}
          seriesName={series.name}
          key={idx}
        />
      );
    });

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.x); })
      .y(function(d){ return yScale(d.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var dx, cx, dy, cy, circleFill;
    var regions = voronoi(prepareValues(props.value, (v) => v.coord )).map(function(vnode, idx) {
      dx = vnode.point.x
      if (dx < xScale.domain()[0] || dx > xScale.domain()[1]) return null;
      cx = props.xScale(dx);
      dy = vnode.point.y
      cy = props.yScale(dy)
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
        <defs>
          <clipPath id="myClip">
            <rect x="0" y="0" width={props.width} height={props.height}/>
          </clipPath>
        </defs>
        <g>{regions}</g>
        <g style={ {"clip-path": 'url(#myClip)'} }>{lines}</g>
      </g>
    );
  }

});
