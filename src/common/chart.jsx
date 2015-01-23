'use strict';

var React = require('react');

exports.Chart = React.createClass({
  render: function() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});
