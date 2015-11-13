
'use strict';

var React = require('react');

module.exports =  {

  propTypes: {
    viewBox:           React.PropTypes.string,
    viewBoxObject:     React.PropTypes.object
  },

  getViewBox() {
    if (this.props.viewBoxObject) {
      var v = this.props.viewBoxObject;
      return [v.x, v.y, v.width, v.height].join(' ');
    } else if (this.props.viewBox) {
      return this.props.viewBox;
    } 
  },

  getDimensions() {
    var props = this.props;
    var {horizontal, margins, viewBoxObject, xOrient, xAxisOffset, yAxisOffset} = props;
    var yOrient = this.getYOrient();

    var width, height;
    if (viewBoxObject) {
      width = viewBoxObject.width,
      height = viewBoxObject.height
    } else {
      width = props.width,
      height = props.height
    }

    var svgWidth, svgHeight;
    var xOffset, yOffset;
    var svgMargins;
    var trans;
    if (horizontal) {
      var center = width / 2;
      trans = `rotate(90 ${ center } ${ center }) `;
      svgWidth = height;
      svgHeight = width;
      svgMargins = {
        left: margins.top,
        top: margins.right,
        right: margins.bottom,
        bottom: margins.left
      };
    } else {
      trans = '';
      svgWidth = width;
      svgHeight = height;
      svgMargins = margins;
    }

    var xAxisOffset = Math.abs(props.xAxisOffset || 0);
    var yAxisOffset = Math.abs(props.yAxisOffset || 0);

    var xOffset = svgMargins.left + (yOrient === 'left' ? yAxisOffset : 0);
    var yOffset = svgMargins.top + (xOrient === 'top' ? xAxisOffset : 0);
    trans += `translate(${ xOffset }, ${ yOffset })`;

    return {
      innerHeight: svgHeight - svgMargins.top - svgMargins.bottom - xAxisOffset,
      innerWidth: svgWidth - svgMargins.left - svgMargins.right - yAxisOffset,
      trans: trans,
      svgMargins: svgMargins
    };
  }

};
