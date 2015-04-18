'use strict';

var React = require('react');
var d3 = require('d3');
var Line = require('./Line');
var Circle = require('./Circle');


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    interpolationType: React.PropTypes.string,
    fill: React.PropTypes.string,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    displayDataPoints: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      data: [],
      interpolationType: 'linear',
      fill: '#fff',
      xAccessor: (d) => d.x,
      yAccessor: (d) => d.y,
      displayDataPoints: true
    };
  },

  _isDate(d, accessor) {
    return Object.prototype.toString.call(accessor(d)) === '[object Date]';
  },

  render() {

    var props = this.props;

    var xAccessor = props.xAccessor,
        yAccessor = props.yAccessor;

    // Create array of paths, which we'll map over
    // to generate SVG lines
    var interpolatePath = d3.svg.line()
        .y(function(d) {
          return props.yScale(props.yAccessor(d));
        })
        .interpolate(props.interpolationType);

    // Check whether or not an arbitrary data element
    // is a date object (at index 0 here)
    // If it's a date, then we set the x scale a bit differently
    if (this._isDate(props.data[0], xAccessor)) {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d).getTime());
        });
    } else {
        interpolatePath.x(function(d) {
          return props.xScale(props.xAccessor(d));
        });
    }


    // Create an immstruct reference for the series name
    // and set it to 'inactive'
    props.structure.cursor('voronoiSeries').set(props.seriesName, 'inactive');

    // Having set the Voronoi line series name cursor to 'inactive'
    // We now pass on the Voronoi line series name reference to the
    // *both* the line and circle component
    var voronoiSeriesRef = props.structure.reference(['voronoiSeries', props.seriesName]);


    var circles = null;

    if (props.displayDataPoints) {
      // Map over data to generate SVG circles at data points
      // if datum is a date object, treat it a bit differently
      circles = props.data.map(function(point, i) {
        var cx, cy;
        if (this._isDate(point, xAccessor)) {
          cx = props.xScale(xAccessor(point).getTime());
        } else {
          cx = props.xScale(xAccessor(point));
        }
        if (this._isDate(point, yAccessor)) {
          cy = props.yScale(yAccessor(point).getTime());
        } else {
          cy = props.yScale(yAccessor(point));
        }

        var id= props.seriesName + '-' + i;

        // Create an immstruct reference for the circle id
        // and set it to 'inactive'
        props.structure.cursor('voronoi').set(id, 'inactive');

        // Having set the Voronoi circle id cursor to 'inactive'
        // We now pass on the Voronoi circle id reference to the
        // circle component, where it will be observed and dereferenced
        var voronoiRef = props.structure.reference(['voronoi', id]);

        return (
          <Circle
            voronoiRef={voronoiRef}
            voronoiSeriesRef={voronoiSeriesRef}
            structure={props.structure}
            cx={cx}
            cy={cy}
            r={props.pointRadius}
            fill={props.fill}
            key={props.seriesName + i}
            id={props.seriesName + '-' + i}
          />
        );
      }, this);
    }

    return (
      <g>
        <Line
          voronoiSeriesRef={voronoiSeriesRef}
          path={interpolatePath(props.data)}
          stroke={props.fill}
          seriesName={props.seriesName}
        />
        {circles}
      </g>
    );
  }

});
