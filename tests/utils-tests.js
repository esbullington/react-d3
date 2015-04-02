'use strict';

var expect = require('chai').expect;

describe('Utils Test', () => {

  var utils;

  before(() => {
    utils = require('../src/utils');
  });

  it('flatten data and calculate scales', () => {

    var generate = require('./utils/datagen').generateArrayOfPoints;

    var points = 5,
        width = 300,
        height = 200;

    var data = [
      {
        name: "series1",
        values: generate(5)
      },
      {
        name: "series2",
        values: generate(5)
      }
    ];

    var pointsGenerated = Object.keys(data).length * points;

    var xAccessor = (d) => d.x;
    var yAccessor = (d) => d.y;
    var { allValues, xValues, yValues }= utils.flattenData(data, xAccessor, yAccessor);

    expect(allValues).to.have.length(pointsGenerated);
    expect(xValues).to.have.length(pointsGenerated);
    expect(yValues).to.have.length(pointsGenerated);

    var scales = utils.calculateScales(width, height, xValues, yValues);
    expect(scales).to.have.keys(['xScale', 'yScale']);
  });

  it('shade #hex color and return #hex color', () => {
     
    var hex = '#AA99b6', percent = 0.3;

    var color = utils.shade(hex, percent);
    expect(color).to.match(/^#([0-9a-f]{6})|([0-9a-f]{3})$/);
    expect(color).to.not.equal(hex);

  });
});

