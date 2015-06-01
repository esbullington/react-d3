'use strict';

var React = require('react');
var mixins = require('../../mixins');

module.exports = React.createClass({

  displayName: 'BasicChart',

  propTypes: {
    title:    React.PropTypes.node,
    width:    React.PropTypes.node,
    height:   React.PropTypes.node,
    children: React.PropTypes.node,
  },

  _renderTitle() {
    var props = this.props;

    if (props.title != null) {
      return (
        <h4>{props.title}</h4>
      );
    } else {
      return null;
    }
  },

  _renderChart: function() {
    var props = this.props;

    return (
      <svg
        viewBox={props.viewBox}
        width={props.width}
        height={props.height}
      >
        {props.children}
      </svg>
    );
  },

  render: function() {
    if (this.props.title != null) {
      return (
        <div>
          {this._renderTitle()}
          {this._renderChart()}
        </div>
      );
    } else {
      return this._renderChart();
    }
  }
});
