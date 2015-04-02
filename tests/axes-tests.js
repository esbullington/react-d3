'use strict';

var expect = require('chai').expect;

describe('Axes', function() {
  it('renders and tests axes component', function() {
    var React = require('react/addons');
    var YAxis = require('../src/common/axes').YAxis;
    var XAxis = require('../src/common/axes').XAxis;
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var utils = require('../src/utils');

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

    var xAccessor = (d) => d.x;
    var yAccessor = (d) => d.y;

    var allData = utils.flattenData(data, xAccessor, yAccessor);
    var scales = utils.calculateScales(width, height, allData.xValues, allData.yValues);
    
    var yaxis = TestUtils.renderIntoDocument(
      <YAxis
        data={allData.allValues}
        yScale={scales.yScale}
        width={width}
        height={height}
      /> 
    );
    
    expect(yaxis).to.exist;

    var yAxisComponent = TestUtils.scryRenderedDOMComponentsWithTag(
    yaxis, 'line');

    // Will have at least as many lines as data points
    expect(yAxisComponent).to.have.length.greaterThan(points);

  });
});
