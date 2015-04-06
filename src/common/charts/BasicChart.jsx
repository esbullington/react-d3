'use strict';

var React = require('react');

module.exports = React.createClass({

  displayName: 'BasicChart',

  render: function() {
    return (
      <div>
        <h4>{this.props.title}</h4>
        <svg
          viewBox={this.props.viewBox}
          width={this.props.width}
          height={this.props.height}
        >{this.props.children}</svg>
      </div>
    );
  }
});
