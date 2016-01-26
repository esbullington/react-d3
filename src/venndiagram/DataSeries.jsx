'use strict';

var React = require('react');
var d3 = require('d3');
var CircleContainer = require('./CircleContainer');
var IntersectionContainer = require('./IntersectionContainer');
var { venn, normalizeSolution, scaleSolution } = require('./venn.js/layout.js');

module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    _data:          React.PropTypes.array,
    colors:         React.PropTypes.func,
    colorAccessor:  React.PropTypes.func,
    height:         React.PropTypes.number,
    width:          React.PropTypes.number,
    valuesAccessor: React.PropTypes.func,
    orientation:    React.PropTypes.number,
    fillOpacity:    React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      orientation:      Math.PI / 2,
      orientationOrder: null,
      fillOpacity: .6,
    };
  },
  
  render() {
    var { _data, width, height, orientation, orientationOrder, intersection, trans } = this.props;
    var solution = venn(_data);
    solution = normalizeSolution(solution, orientation, orientationOrder);
    
    const scaled = scaleSolution(solution, width, height, 0);
    const circles = Object.keys(scaled)
                  .map((key) => { 
                    return {
                      name: key,
                      ..._data.find(({sets}) => sets.length === 1 && sets[0] === key),
                      ...scaled[key]
                    };
                  });

    
    return (
      <g transform={trans}>
        {this._renderCircles(circles)}
        <IntersectionContainer
          {...this.props} 
          dataPoint={intersection}
          circles={circles}
          zIndex="-1"
          z-index="-1"
          onClick={this.props.onIntersectionClick} />
         <use id="use" xlinkHref="#intersection" />
      </g>
    );
  },

  _renderCircles(circles) {
    return circles.map(this._renderCircleContainer);
  },

  _renderCircleContainer(segment, seriesIdx) {
    var { colors, colorAccessor, height, hoverAnimation, fillOpacity } = this.props;
    return (
      <CircleContainer
        r={segment.radius}
        x={segment.x}
        y={segment.y}
        fill={segment.color || colors(colorAccessor(segment, seriesIdx))}
        fillOpacity={fillOpacity}
        hoverAnimation={hoverAnimation}
        onMouseOver={this.props.onMouseOver}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onCircleClick}
        dataPoint={segment}
        key={`circle--${seriesIdx}`}
      />
    )
  }

});
