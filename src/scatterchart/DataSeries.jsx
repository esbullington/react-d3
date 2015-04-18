'use strict';

var React = require('react');
var Circle = require('./Circle');


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

  render() {

    var props = this.props;

    var circles = props.data.map((point, i) => {

      var xAccessor = props.xAccessor,
          yAccessor = props.yAccessor,
          cx, cy;
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

      var id = props.name + '-' + i;

      // Create an immstruct reference for the circle id
      // and set it to 'inactive'
      props.structure.cursor('voronoi').set(id, 'inactive');

      // Having set the Voronoi circle id cursor to 'inactive'
      // We now pass on the Voronoi circle id reference to the
      // circle component, where it will be observed and dereferenced
      var voronoiRef = props.structure.reference(['voronoi', id]);

      return (<Circle
        voronoiRef={voronoiRef}
        cx={cx}
        cy={cy}
        r={props.pointRadius}
        fill={props.fill}
        key={props.name + i}
        id={id}
      />);
    }, this);

    return (
      <g>
        {circles}
      </g>
    );
  }

});
