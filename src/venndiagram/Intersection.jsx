'use strict';

var React = require('react');
var { intersectionAreaPath } = require('venn.js/build/venn.min.js');

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    circles: React.PropTypes.array,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      offset: 0,
      fillOpacity: 1,
      className: 'rd3-venndiagram-intersection'
    };
  },

  handleClick(e) {
    const { onClick, dataPoint } = this.props;
    if (typeof onClick !== 'function') {
      return;
    }
    onClick(e, dataPoint);
  },

  render() {
    var circles = this.props.circles;
    var intersectionPath = intersectionAreaPath(circles);
    
    return (
      <path
        id="intersection"
        zIndex="-1"
        d={intersectionPath}
        className='rd3-venndiagram-intersection'
        {...this.props}
        fill={this.props.fill}
        fillOpacity={this.props.fillOpacity}
        onMouseOver={this.props.handleMouseOver}
        onMouseLeave={this.props.handleMouseLeave}
        onClick={this.handleClick}
      />
    );
  }
});
