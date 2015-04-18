'use strict';

var React = require('react');
var d3 = require('d3');

module.exports = React.createClass({

  displayName: 'Legend',

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    text: React.PropTypes.string,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      text: "#000",
      colors: d3.scale.category20c()
    };
  },

  render: function() {

    var props = this.props;

    var textStyle = {
      'color': 'black',
      'fontSize': '50%',
      'verticalAlign': 'top'
    };

    var legendItems = [];

    props.data.forEach( (series, idx) => {

      var itemStyle = {
        'color': props.colors(idx),
        'lineHeight': '60%',
        'fontSize': '200%'
      };

      legendItems.push(
            <li style={itemStyle} key={series.name + idx} >
              <span style={textStyle}>{series.name}</span>
            </li>
          );

    });

    // In preparation for legend positioning
    var legendFloat = 'right';

    var topMargin = props.margins.top;

    var legendBlockStyle = {
      'wordWrap': 'break-word',
      'width': props.sideOffset,
      'paddingLeft': '0',
      'marginBottom': '0',
      'marginTop': topMargin,
      'float': legendFloat
    };

    return <ul style={legendBlockStyle}>{legendItems}</ul>;
  }

});
