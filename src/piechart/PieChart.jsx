'use strict';

var React = require('react');
var DataSeries = require('./DataSeries');
var Chart = require('../common').Chart;


module.exports = React.createClass({

  displayName: 'PieChart',

  propTypes: {
    data:               React.PropTypes.array,
    radius:             React.PropTypes.number,
    cx:                 React.PropTypes.number,
    cy:                 React.PropTypes.number,
    labelTextFill:      React.PropTypes.string,
    valueTextFill:      React.PropTypes.string,
    valueTextFormatter: React.PropTypes.func,
    colors:             React.PropTypes.func,
    colorAccessor:      React.PropTypes.func,
    title:              React.PropTypes.string,
    showInnerLabels:    React.PropTypes.bool,
    showOuterLabels:    React.PropTypes.bool,
    sectorBorderColor:  React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data:               [],
      title:              '',
      colors:             d3.scale.category20c(),
      colorAccessor:      (d, idx) => idx,
      valueTextFormatter: (val) => `${ val }%`
    };
  },

  render: function() {
    var props = this.props;

    var transform = `translate(${ props.cx || props.width/2 },${ props.cy || props.height/2 })`;

    var values = props.data.map( (item) => item.value );
    var labels = props.data.map( (item) => item.label );

    return (
      <Chart
        width={props.width}
        height={props.height}
        title={props.title}
      >
        <g className='rd3-piechart'>
          <DataSeries
            labelTextFill={props.labelTextFill}
            valueTextFill={props.valueTextFill}
            valueTextFormatter={props.valueTextFormatter}
            data={props.data}
            values={values}
            labels={labels}
            colors={props.colors}
            colorAccessor={props.colorAccessor}
            transform={transform}
            width={props.width}
            height={props.height}
            radius={props.radius}
            innerRadius={props.innerRadius}
            showInnerLabels={props.showInnerLabels}
            showOuterLabels={props.showOuterLabels}
            sectorBorderColor={props.sectorBorderColor}
          />
        </g>
      </Chart>
    );
  }

});
