'use strict';

var React = require('react');
var d3 = require('d3');
var Area = require('./Area');

module.exports = React.createClass({

  displayName: 'DataSeries',
  
  render() {

    var props = this.props;

    var area = d3.svg.area()
      .x((d)=> { return props.xScale(props.xAccessor(d)); })
      .y0((d)=> { return props.yScale(d.y0); })
      .y1((d)=> { return props.yScale(d.y0 + props.yAccessor(d)); });

    var path = area(props.data);

    return (
      <Area fill={props.colors(props.index)} path={path} />
    );
  }

});
