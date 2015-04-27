'use strict';

var React = require('react');
var d3 = require('d3');
var CircleAndPolygon = require('./CircleAndPolygon');
var shade = require('../utils').shade;

// polygon acts as a container to handle animation(state)
var Polygon = React.createClass({

  getDefaultProps() {
    return { 
      initialRadius: 5,
      initialFill: '#1f77b4'
    }
  },

  getInitialState() {
    return { 
      circleRadius: 5,
      circleFill : '#1f77b4'
    }
  },

  _animateCircle() {
    this.setState({ 
      circleRadius: this.state.circleRadius * ( 5 / 4 ),
      circleFill: shade(this.props.initialFill, 0.2)
    });
  },

  _restoreCircle() {
    this.setState({ 
      circleRadius: this.props.initialRadius,
      circleFill: this.props.initialFill
    });
  },

  render: function() {
    return (
      <CircleAndPolygon
        handleOnMouseOver={this._animateCircle}
        handleOnMouseLeave={this._restoreCircle}
        cx={this.props.cx}
        cy={this.props.cy}
        vnode={this.props.vnode}
        r={this.state.circleRadius}
        fill={this.state.circleFill}
      />
    )
  }
});


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      data: [],
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y
    };
  },
  
  render: function() {
    var props = this.props;
    var xScale = props.xScale;
    var yScale = props.yScale;
    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor,
        cx, cy;

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.coord.x); })
      .y(function(d){ return yScale(d.coord.y); })
      .clipExtent([[0, 0], [ props.width , props.height]]);

    var regions = voronoi(this.props.data).map(function(vnode, idx) {
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
      return (
          <Polygon 
              key={idx} id={vnode.point.id} vnode={vnode} 
              cx={cx} cy={cy} r={this}
          />
      )
    }.bind(this));

    return (
      <g id="voronoi">
        {regions}
      </g>
    );
  }

});
