'use strict';

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h4>{this.props.title}</h4>
        <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});
