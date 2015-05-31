
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

  getOuterDimensions() {
    if (this.props.viewBoxObject) {
      return {
        width: this.props.viewBoxObject.width,
        height: this.props.viewBoxObject.height
      };
    } else {
      return {
        width: this.props.width,
        height: this.props.height
      };
    }
  }

};
