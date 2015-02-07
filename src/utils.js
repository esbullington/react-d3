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


exports.flattenData = (data) => {

  var allValues = [];
  var xValues = [];
  var yValues = [];
  var coincidentCoordinateCheck = {};

  Object.keys(data).forEach( (seriesName) => {
    data[seriesName].forEach( (item, idx) => {
      // Check for NaN since d3's Voronoi cannot handle NaN values
      // Go ahead and Proceed to next iteration since we don't want NaN
      // in allValues or in xValues or yValues
      if (isNaN(item.x) || isNaN(item.y)) {
        return;
      }
      xValues.push(item.x);
      yValues.push(item.y);
      var xyCoords = item.x + "-" + item.y;
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
          x: item.x,
          y: item.y,
        },
        id: seriesName + '-' + idx
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
  return '#' + red + green + blue; 

}; 

