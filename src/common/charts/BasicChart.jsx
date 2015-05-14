'use strict';

var React = require('react');
var mixins = require('../../mixins');
var ViewBoxMixin = mixins.ViewBoxMixin;

module.exports = React.createClass({

  mixins: [ ViewBoxMixin ],

  displayName: 'BasicChart',

  propTypes: {
    title:    React.PropTypes.node,
    width:    React.PropTypes.number,
    height:   React.PropTypes.number,
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
        viewBox={this.getViewBox()}
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
