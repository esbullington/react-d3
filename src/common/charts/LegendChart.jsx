'use strict';

var React = require('react');
var Legend = require('../Legend');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'LegendChart',

  propTypes: {
    children:       React.PropTypes.node,
    createClass:    React.PropTypes.string,
    colors:         React.PropTypes.func,
    colorAccessor:  React.PropTypes.func,
    data:           React.PropTypes.array,
    height:         React.PropTypes.node,
    legend:         React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    margins:        React.PropTypes.object,
    sideOffset:     React.PropTypes.number,
    svgClassName:   React.PropTypes.string,
    title:          React.PropTypes.node,
    titleClassName: React.PropTypes.string,
    viewBox:        React.PropTypes.string,
    width:          React.PropTypes.node
  },

  getDefaultProps() {
    return {
      className:      'rd3-legend-chart',
      colors:         d3.scale.category20c(),
      colorAccessor:  (d, idx) => idx,
      data:           [],
      legend:         false,
      legendPosition: 'right',
      sideOffset:     90,
      svgClassName:   'rd3-chart',
      titleClassName: 'rd3-chart-title'
    };
  },

  _renderLegend() {
    var props = this.props;

    if (props.legend) {
      return (
        <Legend
          colors={props.colors}
          colorAccessor={props.colorAccessor}
          data={props.data}
          legendPosition={props.legendPosition}
          margins={props.margins}
          width={props.sideOffset}
        />
      );
    }
  },

  _renderTitle() {
    var props = this.props;

    if (props.title != '' && props.title != null) {
      return (
        <h4
          className={props.titleClassName}
        >
          {props.title}
        </h4>
      );
    }
    return null;
  },

  _renderChart: function() {
    var props = this.props;

    return (
      <svg
        className={props.svgClassName}
        height="100%"
        viewBox={props.viewBox}
        width="100%"
      >
        {props.children}
      </svg>
    );
  },

  render() {
    var props = this.props;

    return (
      <div
        className={props.className}
        style={{'width': props.width, 'height': props.height}}
      >
        {this._renderTitle()}
        <div style={{ display: 'table', width: '100%', height: '100%' }}>
          <div style={{ display: 'table-cell' }}>
            {this._renderChart()}
          </div>
          <div style={{ display: 'table-cell', width: props.sideOffset, 'verticalAlign': 'top' }}>
            {this._renderLegend()}
          </div>
        </div>
      </div>
    );
  }
});
