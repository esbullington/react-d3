'use strict';

var React = require('react');
var LegendChart = require('./LegendChart');
var BasicChart = require('./BasicChart');

module.exports = React.createClass({

  displayName: 'Chart',
  
  propTypes: {
    legend: React.PropTypes.bool,
    viewBox: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      legend: false
    };
  },

  render: function() {
    if (this.props.legend) {
      return <LegendChart {...this.props} />;
    }
    return <BasicChart {...this.props} />;
  }

});

