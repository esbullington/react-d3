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

  render: function() {
    
    var textStyle = {
      'textAnchor': 'middle',
      'fill': this.props.textColor,
      'fontSize': this.props.fontSize
    };

    var t = 'translate(' + this.props.x + ',' + this.props.y + ')';

    return (
      <g transform={t}>
        <rect
          fill={this.props.fill} 
          width={this.props.width}
          height={this.props.height}
          className='rd3-treemap-rect'
        />
        <text
          x={this.props.width / 2}
          y={this.props.height / 2}
          dy='.35em'
          style={textStyle}
          className='rd3-treemap-text'
        >
          {this.props.label}
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
 
  getDefaultProps: function() {
    return {
      data: [],
      value: 'value',
      label: 'label'
    };
  },

  render: function() {
    
    var data = this.props.data;
    var value = this.props.value;
    var label = this.props.label;

    var colors = d3.scale.category20c();

    var treemap = d3.layout.treemap()
                    // make sure calculation loop through all objects inside array 
                    .children(function(d) { return d; })
                    .size([this.props.width, this.props.height])
                    .sticky(true)
                    .value(function(d) { return d[value]; });
    
    var cells = treemap(data).map(function(node, i) {
      return (
        <Cell
          x={node.x}
          y={node.y}
          width={node.dx}
          height={node.dy}
          fill={colors(i)} 
          label={node[label]}
          fontSize={this.props.fontSize}
          textColor={this.props.textColor}
          key={i}
        /> 
      ); 
    }, this);

    return (
      <g transform={this.props.transform} className='treemap'>
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

  getDefaultProps: function() {
    return {
      data: [], 
      width: 400,
      heigth: 200,
      title: '',
      textColor: '#f7f7f7',
      fontSize: '0.85em'
    };
  },

  render: function() {
    
    return (
      <Chart 
        title={this.props.title}
        width={this.props.width}
        height={this.props.height}
      >
        <g className='rd3-treemap'>
          <DataSeries
            width={this.props.width}
            height={this.props.height}
            data={this.props.data}
            textColor={this.props.textColor}
            fontSize={this.props.fontSize}
          />
        </g>
      </Chart>
    );
  }

});

exports.Treemap = Treemap;
