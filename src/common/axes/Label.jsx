'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Label',

  propTypes: {
    height:              React.PropTypes.number,
    horizontalChart:     React.PropTypes.bool,
    horizontalTransform: React.PropTypes.string,
    label:               React.PropTypes.string.isRequired,
    width:               React.PropTypes.number,
    strokeWidth:         React.PropTypes.number,
    textAnchor:          React.PropTypes.string,
    verticalTransform:   React.PropTypes.string
  },

  getDefaultProps() {
    return {
      horizontalTransform: 'rotate(270)',
      strokeWidth:         0.01,
      textAnchor:          'middle',
      verticalTransform:   'rotate(0)'
    };
  },

  render() {

    var props = this.props;

    if (!props.label) {
      return <text/>;
    }

    var transform, x, y;
    if (props.orient === 'top' || props.orient === 'bottom') {
      transform = props.verticalTransform;
      x = props.width / 2;
      y = props.offset;

      if (props.horizontalChart) {
        transform = `rotate(180 ${x} ${y}) ${transform}`;
      }
    } else {  // left, right
      transform = props.horizontalTransform;
      x = -props.height / 2; 
      if (props.orient === 'left') {
        y = -props.offset;
      } else {
        y = props.offset;
      }
    }


    return (
      <text
        strokeWidth={props.strokeWidth.toString()}
        textAnchor={props.textAnchor}
        transform={transform}
        y={y}
        x={x}
      >
        {props.label}
      </text>
    );
  }

});
