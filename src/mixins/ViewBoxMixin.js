
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
    var {margins, viewBoxObject} = props;
    var width;
    var height;
    
    if (viewBoxObject) {
      width = viewBoxObject.width,
      height = viewBoxObject.height
    } else {
      width = props.width,
      height = props.height
    }

    return {
      width: width,
      height: height,
      innerWidth: width - margins.left - margins.right,
      innerHeight: height - margins.top - margins.bottom
    };
  }

};
