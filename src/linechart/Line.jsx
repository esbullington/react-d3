'use strict';

var React = require('react');


module.exports = React.createClass({

  displayName: 'Line',

  propTypes: {
    fill: React.PropTypes.string,
    path: React.PropTypes.string,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number,
    strokeDashArray: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      stroke: '#3182bd',
      fill: 'none',
      strokeWidth: 1,
      className: 'rd3-linechart-path'
    };
  },

  render() {
    var props = this.props;
    var clipPathId = "lineClip."+props.seriesName+"."+props.override;

    var mergeRanges = (ranges) => {
      var out = [];
      var lastrange = null;
      ranges.forEach((range) => {
        if (lastrange && lastrange[1] == range[0]) {
          lastrange[1] = range[1]
        } else {
          out.push(lastrange = [range[0],range[1]])
        }
      });
      return out
    };

    var invertRanges = (ranges,from,to) => {
      var keypoints = [from];
      mergeRanges(ranges).forEach((range) => { keypoints.push(range[0]); keypoints.push(range[1]) });
      keypoints.push(to);
      var out = [];
      for (var i=0; i<keypoints.length; i += 2) out.push([keypoints[i],keypoints[i+1]])
      return out;
    };

    var cleanRanges = (ranges,from,to) => {
      var out = [];
      ranges.forEach( (range) => {
        if (range[1] <= range[0]) return;
        if (range[1] < from) return;
        if (range[0] > to) return;
        var newrange = [range[0],range[1]];
        if (range[0] < from) newrange[0] = from;
        if (range[1] > to) newrange[1] = to;
        out.push(newrange)
      });
      return out;
    };

    var ranges = props.coverage.ranges;
    if (props.coverage.invert) {
      ranges = invertRanges(ranges,0,props.width);
    } else {
      ranges = mergeRanges(ranges);
    }
    ranges = cleanRanges(ranges,0,props.width);

    return (<g>
      <clipPath id={clipPathId} key={clipPathId}>
        { ranges.map( (r) => <rect x={r[0]} y={0} width={r[1]-r[0]} height={props.height}/>) }
      </clipPath>
      <path
        d={props.path}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        strokeDasharray={props.strokeDashArray}
        fill={props.fill}
        className={props.className}
        style={{"clipPath": 'url(#'+clipPathId+')'}}
      />
    </g>);
  }

});
