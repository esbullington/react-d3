'use strict';

var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;

var Cell = React.createClass({

  propTypes: {
    fill: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    label: React.PropTypes.string
  },

  render() {

    var props = this.props;
    
    var textStyle = {
      'textAnchor': 'middle',
      'fill': props.textColor,
      'fontSize': props.fontSize
    };

    var t = `translate(${props.x}, ${props.y}  )`;

    return (
      <g transform={t}>
        <rect
          fill={props.fill} 
          width={props.width}
          height={props.height}
          className='rd3-treemap-cell'
        />
        <text
          x={props.width / 2}
          y={props.height / 2}
          dy='.35em'
          style={textStyle}
          className='rd3-treemap-cell-text'
        >
          {props.label}
        </text>
      </g>
    );
  }
});

var DataSeries = React.createClass({
  
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
          key={i}
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

var Treemap = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    data: React.PropTypes.array, 
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontSize: React.PropTypes.oneOfType([ 
      React.PropTypes.string,
      React.PropTypes.number
    ])

  },

  getDefaultProps() {
    return {
      data: [], 
      width: 400,
      heigth: 200,
      title: '',
      textColor: '#f7f7f7',
      fontSize: '0.85em'
    };
  },

  render() {

    var props = this.props;
    
    return (
      <Chart 
        title={props.title}
        width={props.width}
        height={props.height}
      >
        <g className='rd3-treemap'>
          <DataSeries
            width={props.width}
            height={props.height}
            data={props.data}
            textColor={props.textColor}
            fontSize={props.fontSize}
          />
        </g>
      </Chart>
    );
  }

});

exports.Treemap = Treemap;
