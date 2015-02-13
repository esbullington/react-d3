var d3 = require('d3');


exports.calculateScales = (chartWidth, chartHeight, xValues, yValues) => {

  var xScale, yScale;

  xScale = d3.scale.linear()
    .domain([d3.min([d3.min(xValues), 0]), d3.max(xValues)])
    .range([0, chartWidth]);

  yScale = d3.scale.linear()
    .domain([d3.min([d3.min(yValues), 0]), d3.max(yValues)])
    .range([chartHeight, 0]);

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


exports.flattenData = (data, xAccessor, yAccessor) => {

  // Check if second parameter is an obj of accessors
  var accessors = (typeof xAccessor === "object" ? xAccessor : {});
  if (xAccessor && typeof xAccessor === "function") {accessors.x = xAccessor;}
  if (yAccessor && typeof yAccessor === "function") {accessors.y = yAccessor;}

  var values = {};

  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  data.forEach( (series) => {
    series.values.forEach( (item, idx) => {

      // Iterate through all props in the current value object
      Object.keys(item).forEach( (dimension) => {

        // Create prop in values object for each dimension
        if (!values[dimension]) {
          values[dimension] = [];
        }

        // Push dimension to the corresponding array,
        // using an accesor if it exists
        values[dimension].push(
          accessors[dimension] ?
            accessors[dimension](item) :
            item[dimension]
          );
      });

      // Check for NaN since d3's Voronoi cannot handle NaN values
      // Go ahead and Proceed to next iteration since we don't want NaN
      // in allValues or in xValues or yValues
      if (isNaN(item.x) || isNaN(item.y)) {
        return;
      }
      var x = accessors.x ? accessors.x(item) : item.x;
      var y = accessors.y ? accessors.y(item) : item.y;
      var xyCoords = `${ x }-${ y }`;
      if (xyCoords in coincidentCoordinateCheck) {
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
          y: y,
        },
        id: `${ series.name }-${ idx }`
      };
      allValues.push(pointItem);
    });
  });


  values.allValues= allValues;
  values.xValues= values.x;
  values.yValues= values.y;
  return values;
};



exports.shade = (hex, percent) => {

  var R, G, B, red, green, blue, number;
  var min = Math.min, round = Math.round;
  if(hex.length !== 7) { return hex; }
  number = parseInt(hex.slice(1), 16);
  R = number >> 16;
  G = number >> 8 & 0xFF;
  B = number & 0xFF;
  red = min( 255, round( ( 1 + percent ) * R )).toString(16);
  green = min( 255, round( ( 1 + percent ) * G )).toString(16);
  blue = min( 255, round( ( 1 + percent ) * B )).toString(16);
  return `#${ red }${ green }${ blue }`;

};
