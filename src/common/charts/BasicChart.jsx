'use strict';

var React = require('react');
var mixins = require('../../mixins');

module.exports = React.createClass({

  displayName: 'BasicChart',

  propTypes: {
    children:       React.PropTypes.node,
    className:      React.PropTypes.string,
    height:         React.PropTypes.node,
    svgClassName:   React.PropTypes.string,
    title:          React.PropTypes.node,
    titleClassName: React.PropTypes.string,
    width:          React.PropTypes.node
  },

  getDefaultProps() {
    return {
      className:      'rd3-basic-chart',
      svgClassName:   'rd3-chart',
      titleClassName: 'rd3-chart-title'
    };
  },

  _renderTitle() {
    var props = this.props;

    if (props.title != '' && props.title != null) {
      return (
        <h4
          className={props.titleClassName}
        >
          {props.title}
        </h4>
      );
    } else {
      return null;
    }
  },

  _renderChart: function() {
    var props = this.props;

    return (
      <svg
        className={props.svgClassName}
        height={props.height}
        viewBox={props.viewBox}
        width={props.width}
      >
        {props.children}
      </svg>
    );
  },

  render: function() {
    var props = this.props;

    return (
      <div
        className={props.className}
      >
        {this._renderTitle()}
        {this._renderChart()}
      </div>
    );
  }
});
