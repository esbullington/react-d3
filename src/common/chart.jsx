'use strict';

var React = require('react');
var Legend = require('./legend').Legend;

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

exports.LegendChart = React.createClass({

  propTypes: {
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      data: {},
      colors: d3.scale.category20c(),
      legend: false,
      legendPosition: 'right',
      sideOffset: 100
    };
  },

  _renderLegend: function() {
    if (this.props.legend) {
      return (
        <Legend 
          legendPosition={this.props.legendPosition}
          margins={this.props.margins}
          colors={this.props.colors}
          data={this.props.data}
          width={this.props.width}
          height={this.props.height}
        /> 
      );
    }
  },

  render: function() {
    return (
      <div style={{'width': this.props.width, 'height': this.props.height}} >
        <h3>{this.props.title}</h3>
        {this._renderLegend()}
        <svg width={this.props.width - this.props.sideOffset} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});
