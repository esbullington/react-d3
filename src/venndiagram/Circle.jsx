'use strict';

var React = require('react');

var circlePath = require('venn.js/circlePath');

module.exports = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    fillOpacity: React.PropTypes.number,
    r: React.PropTypes.number,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      offset: 0,
      fillOpacity: 1,
      className: 'rd3-venndiagram-circle',
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
    const { x, y, r } = this.props;
    return (
      <path
        d={circlePath(x, y, r)}
        className='rd3-venndiagram-circle'
        {...this.props}
        fill={this.props.fill}
        width={r}
        height={r}
        fillOpacity={this.props.fillOpacity}
        onMouseOver={this.props.handleMouseOver}
        onMouseLeave={this.props.handleMouseLeave}
        onClick={this.handleClick}
        zIndex="1" />
    );
  }
});
