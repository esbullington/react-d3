'use strict';

var React = require('react');

module.exports = React.createClass({

  displayName: 'BasicChart',

  propTypes: {
    title: React.PropTypes.node,
    viewBox: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    children: React.PropTypes.node,
  },

  _renderTitle() {
    if (this.props.title != null) {
      return (
        <h4>{this.props.title}</h4>
      );
    }
  },

  _renderChart: function() {
    return (
      <svg
        viewBox={this.props.viewBox}
        width={this.props.width}
        height={this.props.height}
      >{this.props.children}</svg>
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
    }
    else {
      return this._renderChart();
    }
  }
});
