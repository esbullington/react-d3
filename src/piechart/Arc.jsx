'use strict';

var React = require('react');
var d3 = require('d3');


module.exports = React.createClass({

  displayName: 'Arc',

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      labelTextFill: 'black',
      valueTextFill: 'white'
    };
  },

  render() {
    var props = this.props;
    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);
    var rotate = `rotate(${ (props.startAngle+props.endAngle)/2 * (180/Math.PI) })`;
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 35;
    var angle  = (props.startAngle + props.endAngle) / 2;
    var x      = dist * (1.2 * Math.sin(angle));
    var y      = -dist * Math.cos(angle);
    var t = `translate(${x},${y})`;

    // make value text can be formatted
    var formattedValue = props.valueTextFormatter(props.value);

    return (
      <g className='rd3-piechart-arc' >
        <path
          d={arc()}
          fill={props.fill}
        />
        <line
          x1='0'
          x2='0'
          y1={-radius - 2}
          y2={-radius - 26}
          stroke={props.labelTextFill}
          transform={rotate}
          style={{
            'fill': props.labelTextFill,
            'strokeWidth': 2
          }}
        >
        </line>
        <text
          className='rd3-piechart-label'
          transform={t}
          dy='.35em'
          style={{
            'textAnchor': 'middle',
            'fill': props.labelTextFill,
            'shapeRendering': 'crispEdges'
          }}>
          {props.label}
        </text>
        <text
          className='rd3-piechart-value'
          transform={`translate(${arc.centroid()})`}
          dy='.35em'
          style={{
            'shapeRendering': 'crispEdges',
            'textAnchor': 'middle',
            'fill': props.valueTextFill
          }}>
          { formattedValue }
        </text>
      </g>
    );
  }
});
