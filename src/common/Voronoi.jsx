'use strict';

var React = require('react');
var d3 = require('d3');

var Polygon = React.createClass({

  _animateCircle: function() {
    this.props.structure.cursor('voronoi').cursor(this.props.id).update(()=>'active');
    // this.props.pubsub.emit('animate', this.props.id);
  },

  _restoreCircle: function() {
    this.props.structure.cursor('voronoi').cursor(this.props.id).update(()=>'inactive');
    // this.props.pubsub.emit('restore', this.props.id);
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },

  render: function() {
    return <path
      onMouseOver={this._animateCircle}
      onMouseOut={this._restoreCircle}
      fill="white"
      opacity="0"
      d={this._drawPath(this.props.vnode)} />;
  }

});


module.exports = React.createClass({

  displayName: 'Voronoi',

  render: function() {
    var xScale = this.props.xScale;
    var yScale = this.props.yScale;

    var voronoi = d3.geom.voronoi()
      .x(function(d){ return xScale(d.coord.x); })
      .y(function(d){ return yScale(d.coord.y); })
      .clipExtent([[0, 0], [ this.props.width , this.props.height]]);

    var regions = voronoi(this.props.data).map(function(vnode, idx) {
      return <Polygon structure={this.props.structure} key={idx} id={vnode.point.id} vnode={vnode} />;
    }.bind(this));

    return (
      <g>
        {regions}
      </g>
    );
  }

});
