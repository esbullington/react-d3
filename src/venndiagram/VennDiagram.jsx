'use strict';

var React = require('react');
var d3 = require('d3');
var DataSeries = require('./DataSeries');
var utils = require('../utils');

var { Chart, XAxis, YAxis, Tooltip } = require('../common');
var { CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin } = require('../mixins');

module.exports = React.createClass({

  mixins: [ CartesianChartPropsMixin, DefaultAccessorsMixin, ViewBoxMixin, TooltipMixin ],

  displayName: 'VennDiagram',

  propTypes: {
    chartClassName:         React.PropTypes.string,
    data:                   React.PropTypes.array.isRequired,
    hoverAnimation:         React.PropTypes.bool,
    height:                 React.PropTypes.number,
    intersection:           React.PropTypes.object,
    margins:                React.PropTypes.object,
    valuesAccessor:         React.PropTypes.func,
    title:                  React.PropTypes.string,
    width:                  React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      chartClassName:         'rd3-venndiagram',
      hoverAnimation:         true,
      margins:                {top: 10, right: 20, bottom: 40, left: 45},
      valuesAccessor:         d => d,
      intersection:           { name: 'Intersection', size: 0 },
    };
  },

  render() {

    var props = this.props;
    var { innerHeight, innerWidth, trans } = this.getDimensions();

    return (
      <span>
        <Chart
          viewBox={this.getViewBox()}
          legend={props.legend}
          margins={props.margins}
          colors={props.colors}
          colorAccessor={props.colorAccessor}
          width={props.width}
          height={props.height}
          title={props.title}
        >
          <g transform={trans} className={props.chartClassName}>
            <DataSeries
              _data={props.data}
              intersection={props.intersection}
              width={innerWidth}
              height={innerHeight}
              colors={props.colors}
              colorAccessor={props.colorAccessor}
              hoverAnimation={props.hoverAnimation}
              valuesAccessor={props.valuesAccessor}
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
              onCircleClick={props.onCircleClick}
              onIntersectionClick={props.onIntersectionClick}
              />
          </g>
        </Chart>
        {(props.showTooltip ? <Tooltip {...this.state.tooltip} /> : null)}
      </span>
    );
  }

});
