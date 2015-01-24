'use strict';

var React = require('react');

exports.Legend = React.createClass({

  propTypes: {
    legendWidth: React.PropTypes.number,
    legendHeight: React.PropTypes.number,
    lineHeight: React.PropTypes.number,
    fill: React.PropTypes.string,
    margins: React.PropTypes.object,
    text: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    xOffset: React.PropTypes.number,
    yOffset: React.PropTypes.number,
    innerOffset: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      fill: "#fff",
      stroke: "#000",
      text: "#000",
      strokeWidth: 1,
      xOffset: 80,
      yOffset: 10,
      topInnerOffset: 15,
      leftInnerOffset: 30,
      lineHeight: 16
    };
  },

  _calculateDimensions: function(props) {
    var width = props.width * .3;
    var height = 0;
    Object.keys(props.data).forEach(function(el) {
      height += props.lineHeight;
    });
    if (props.legendHeight || props.legendWidth) {
      width = props.legendWidth;
      height = props.legendHeight;
    }
    return {
      width: width,
      height: height
    };
  },

  render: function() {
    var props = this.props;

    var style = {
      "fill": props.fill,
      "strokeWidth": props.strokeWidth,
      "stroke": props.stroke,
      "shapeRendering": "crispEdges"
    };

    var legendItems = [];
    var idx = 0;
    for(var seriesName in props.data) {
      if (props.data.hasOwnProperty(seriesName)) {
        var seriesValue = props.data[seriesName];
        legendItems.push(
              <g transform="translate(10,15)" key={idx} >
                <text y={idx + "em"} x="1em">{seriesName}</text>
                <circle cy={(idx - 0.25) + "em"} cx="0" r="0.4em" fill={props.colors(idx)} />
              </g>
            );
        idx++;
      }
    }

    var trans = "translate(" + 50 + "," + 10 + ")";

    var dimensions = this._calculateDimensions(props);
    var legendHeight = dimensions.height;
    var legendWidth = dimensions.width;

    console.log('w', props.width);
    var xOffset = props.width - 400;

    return (
        <g transform={trans} >
          <rect
            width={legendWidth}
            height={legendHeight}
            style={style}
          >
          </rect>
          {legendItems}
        </g>
      );
  }

});

