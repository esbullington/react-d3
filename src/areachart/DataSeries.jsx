'use strict';

var React = require('react');
var d3 = require('d3');
var AreaContainer = require('./AreaContainer');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    fill:              React.PropTypes.string,
    interpolationType: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      interpolationType: 'linear'
    };
  },

  render() {

    var props = this.props;

    var area = d3.svg.area()
      .x((d)=> { return props.xScale(props.xAccessor(d)); })
      .y0((d)=> { return props.yScale(d.y0); })
      .y1((d)=> { return props.yScale(d.y0 + props.yAccessor(d)); })
      .interpolate(props.interpolationType);

    var path = area(props.data);

    return (
      <AreaContainer 
        fill={props.fill} 
        hoverAnimation={props.hoverAnimation}
        path={path} 
      />
    );
  }

});
