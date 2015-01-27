'use strict';

var React = require('react');
var Legend = require('./legend').Legend;

var PlainChart = React.createClass({
  render: function() {
    return (
      <div>
        <h4>{this.props.title}</h4>
        <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});

var LegendChart = React.createClass({

  propTypes: {
    legend: React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
  },

  getDefaultProps: function() {
    return {
      data: {},
      legend: false,
      legendPosition: 'right',
      sideOffset: 90
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
          sideOffset={this.props.sideOffset}
        /> 
      );
    }
  },

  render: function() {
    return (
      <div style={{'width': this.props.width, 'height': this.props.height}} >
        <h4>{this.props.title}</h4>
        {this._renderLegend()}
        <svg width={this.props.width - this.props.sideOffset} height={this.props.height}>{this.props.children}</svg>
      </div>
    );
  }
});

exports.LegendChart = LegendChart;

exports.Chart = React.createClass({

  propTypes: {
    legend: React.PropTypes.bool,
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
    return <PlainChart {...this.props} />;
  }

});

