'use strict';

var React = require('react');

module.exports = React.createClass({

  propTypes: {
    cx:   React.PropTypes.number,
    cy:   React.PropTypes.number,
    text: React.PropTypes.string,
    show: React.PropTypes.bool
  },

  render: function() {
    var props = this.props;
    var display = this.props.show ? 'inherit' : 'none';
    var containerStyles = {position: 'fixed', top: props.cy, left: props.cx, display: display, opacity: 0.8}
    var tooltipStyles = {
      position: 'absolute',
      backgroundColor: 'white',
      border: '1px solid',
      borderColor: '#ddd',
      borderRadius: '2px',
      padding: '10px',
      marginLeft: '10px',
      marginRight: '10px',
      marginTop: '-15px'
    }
    return (
      <div style={containerStyles}>
        <div style={tooltipStyles}>
          {props.text}
        </div>
      </div>
    );
  }
});
