'use strict';

var React = require('react');
var LegendChart = require('./LegendChart');
var BasicChart = require('./BasicChart');

module.exports = React.createClass({

  displayName: 'Chart',

  propTypes: {
    legend:         React.PropTypes.bool,
    svgClassName:   React.PropTypes.string,
    titleClassName: React.PropTypes.string,
    shouldUpdate:   React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      legend:         false,
      svgClassName:   'rd3-chart',
      titleClassName: 'rd3-chart-title',
      shouldUpdate:   true
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.shouldUpdate;
  },
  render: function() {
    var props = this.props;

    if (props.legend) {
      return (
        <LegendChart
          svgClassName={props.svgClassName}
          titleClassName={props.titleClassName}
          {...this.props}
        />
      );
    }
    return (
      <BasicChart 
        svgClassName={props.svgClassName}
        titleClassName={props.titleClassName}
        {...this.props}
      />
    );
  }

});
