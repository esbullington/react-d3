'use strict';

var React = require('react');
var d3 = require('d3');
var Cell = require('./Cell');


module.exports = React.createClass({

  displayName: 'DataSeries',

  propTypes: {
    data: React.PropTypes.array,
    value: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      data: [],
      value: 'value',
      label: 'label'
    };
  },

  render() {

    var props = this.props;

    var data = props.data;
    var value = props.value;
    var label = props.label;

    var colors = d3.scale.category20c();

    var treemap = d3.layout.treemap()
                    // make sure calculation loop through all objects inside array
                    .children((d)=> d)
                    .size([props.width, props.height])
                    .sticky(true)
                    .value((d)=> { return d[value]; });

    var cells = treemap(data).map((node, i) => {
      return (
        <Cell
          x={node.x}
          y={node.y}
          width={node.dx}
          height={node.dy}
          fill={colors(i)}
          label={node[label]}
          fontSize={props.fontSize}
          textColor={props.textColor}
          key={label + i}
        />
      );
    }, this);

    return (
      <g transform={props.transform} className='treemap'>
        {cells}
      </g>
    );
  }

});
