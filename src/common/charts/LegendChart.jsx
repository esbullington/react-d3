'use strict';

var React = require('react');
var Legend = require('../Legend');

module.exports = React.createClass({

  displayName: 'LegendChart',

  propTypes: {
    colors:         React.PropTypes.func,
    colorAccessor:  React.PropTypes.func,
    title:          React.PropTypes.node,
    viewBox:        React.PropTypes.string,
    width:          React.PropTypes.number,
    height:         React.PropTypes.number,
    children:       React.PropTypes.node,
    legend:         React.PropTypes.bool,
    legendPosition: React.PropTypes.string,
    sideOffset:     React.PropTypes.number,
    margins:        React.PropTypes.object,
    data:           React.PropTypes.oneOfType([
                      React.PropTypes.object,
                      React.PropTypes.array
                    ])
  },

  getDefaultProps() {
    return {
      data:           {},
      legend:         false,
      legendPosition: 'right',
      sideOffset:     90,
      colors:         d3.scale.category20c(),
      colorAccessor:  (d, idx) => idx
    };
  },

  _renderLegend() {
    var props = this.props;

    if (props.legend) {
      return (
        <Legend
          legendPosition={props.legendPosition}
          margins={props.margins}
          colors={props.colors}
          colorAccessor={props.colorAccessor}
          data={props.data}
          width={props.width}
          height={props.height}
          sideOffset={props.sideOffset}
        />
      );
    }
  },

  _renderTitle() {
    var props = this.props;
    if (props.title != null) {
      return <h4>{props.title}</h4>;
    }
    return null;
  },

  render() {
    var props = this.props;

    return (
      <div style={{'width': props.width, 'height': props.height}} >
        {this._renderTitle()}
        {this._renderLegend()}
        <svg viewBox={props.viewBox} width={props.width - props.sideOffset} height={props.height}>{props.children}</svg>
      </div>
    );
  }
});
