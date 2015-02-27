'use strict';

var React = require('react');


module.exports = React.createClass({

  render() {
    var props = this.props;
    if (props.label && (props.orient === 'top' || props.orient === 'bottom')) {
      return (
        <text
          strokeWidth="0.01"
          y={props.offset} x={props.width/2}
          textAnchor='middle' >
          {props.label}
        </text>
      );
    } else if (props.label && (props.orient === 'left' || props.orient === 'right')) {
      return (
        <text
          strokeWidth="0.01"
          y={-props.offset} x={-props.height/2}
          textAnchor='middle'
          transform="rotate(270)">
          {props.label}
        </text>
      );
    }
    return <text/>;
  }

});


