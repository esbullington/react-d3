var d3 = require('d3');


Array.prototype.unique = function() {
  var o = {}, i, l = this.length, r = [];
  for(i=0; i<l;i+=1) o[this[i]] = this[i];
  for(i in o) r.push(o[i]);
  return r;
};

exports.calculateScales = function(chartWidth, chartHeight, xValues, yValues)  {

  var xScale, yScale, tickDist, tickRangeNum;
  var tickRange = [];

  if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object Date]') {
    xScale = d3.time.scale()
      .range([0, chartWidth]);
  } else if (xValues.length > 0 && Object.prototype.toString.call(xValues[0]) === '[object String]'){
    tickDist = (chartWidth) / xValues.unique().length;
    for (tickRangeNum = 0; tickRangeNum < chartWidth; tickRangeNum += tickDist) {
      tickRange.push(tickRangeNum);
    }
    xScale = d3.scale.ordinal().domain(xValues).range(tickRange);
  } else {

    xScale = d3.scale.linear()
      .range([0, chartWidth]);
  }
  xScale.domain(d3.extent(xValues));

  if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object Date]') {
    yScale = d3.time.scale()
      .range([chartHeight, 0]);
  } else if (yValues.length > 0 && Object.prototype.toString.call(yValues[0]) === '[object String]'){
    tickDist = (chartHeight) / yValues.unique().length;
    for (tickRangeNum = 0 ; tickRangeNum < chartHeight; tickRangeNum += tickDist) {
      tickRange.push(tickRangeNum);
    }
    console.log(JSON.stringify(tickRange));
    yScale = d3.scale.ordinal().domain(yValues).range(tickRange);
  }else {
    yScale = d3.scale.linear()
      .range([chartHeight, 0]);
  }

  yScale.domain(d3.extent(yValues));

  return {
    xScale: xScale,
    yScale: yScale
  };

};

// debounce from Underscore.js
// MIT License: https://raw.githubusercontent.com/jashkenas/underscore/master/LICENSE
// Copyright (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative
// Reporters & Editors
exports.debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

exports.flattenData = function(data, xAccessor, yAccessor)  {

  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  data.forEach( function(series, i)  {
    series.values.forEach( function(item, j)  {

      var x = xAccessor(item);
      xValues.push(x);

      var y = yAccessor(item);
      // when yAccessor returns an object (as in the case of candlestick)
      // iterate over the keys and push all the values to yValues array
      var yNode;
      if (typeof y === 'object' && Object.keys(y).length > 0) {
        Object.keys(y).forEach(function (key) {
          yValues.push(y[key]);
          // if multiple y points are to be plotted for a single x
          // as in the case of candlestick, default to y value of 0
          yNode = 0;
        });
      } else {
        yValues.push(y);
        yNode = y;
      }

      var xyCoords = (x + "-" + yNode);
      if (coincidentCoordinateCheck.hasOwnProperty(xyCoords)) {
        // Proceed to next iteration if the x y pair already exists
        // d3's Voronoi cannot handle NaN values or coincident coords
        // But we push them into xValues and yValues above because
        // we still may handle them there (labels, etc.)
        return;
      }
      coincidentCoordinateCheck[xyCoords] = '';

      var pointItem = {
        coord: {
          x: x,
          y: yNode,
        },
        d: item,
        id: series.name + j,
        series: series,
        seriesIndex: i
      };
      allValues.push(pointItem);
    });
  });

  return {
    allValues: allValues,
    xValues: xValues,
    yValues: yValues
  };
};


exports.shade = function(hex, percent)  {

  var R, G, B, red, green, blue, number;
  var min = Math.min, round = Math.round;
  if(hex.length !== 7) { return hex; }
  number = parseInt(hex.slice(1), 16);
  R = number >> 16;
  G = number >> 8 & 0xFF;
  B = number & 0xFF;
  red = min( 255, round( ( 1 + percent ) * R )).toString(16);
  if (red.length === 1) red = '0' + red;
  green = min( 255, round( ( 1 + percent ) * G )).toString(16);
  if (green.length === 1) green = '0' + green;
  blue = min( 255, round( ( 1 + percent ) * B )).toString(16);
  if (blue.length === 1) blue = '0' + blue;
  return ("#" +  red +  green +  blue);

};
