'use strict';

var expect = require('chai').expect;

function generateData(points) {
  var generate = require('./utils/datagen').generateArrayOfPoints;
  var utils = require('../src/utils');

  var data = [
    {
      name: "series1",
      values: generate(points)
    },
    {
      name: "series2",
      values: generate(points)
    }
  ];

  var xAccessor = (d) => d.x;
  var yAccessor = (d) => d.y;

  return utils.flattenData(data, xAccessor, yAccessor);
}

describe('Axes', function() {
  it('renders and tests axes component', function() {
    var React = require('react/addons');
    var YAxis = require('../src/common/axes').YAxis;
    var XAxis = require('../src/common/axes').XAxis;
    var TestUtils = React.addons.TestUtils;
    var utils = require('../src/utils');

    var points = 5,
        width = 300,
        height = 200;

    var allData = generateData(points);
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

    // Will have at least as many lines as data points
    var yAxisComponent = TestUtils.scryRenderedDOMComponentsWithTag(
    yaxis, 'line');
    expect(yAxisComponent).to.have.length.greaterThan(points);

  });

  it('renders and tests axes component with tickValues', function() {
    var React = require('react/addons');
    var YAxis = require('../src/common/axes').YAxis;
    var XAxis = require('../src/common/axes').XAxis;
    var TestUtils = React.addons.TestUtils;
    var utils = require('../src/utils');

    var points = 5,
        width = 300,
        height = 200,
        tickValues = [50];

    var allData = generateData(points);
    var scales = utils.calculateScales(width, height, allData.xValues, allData.yValues);

    var yaxis = TestUtils.renderIntoDocument(
      <YAxis
        yAxisTickValues={tickValues}
        data={allData.allValues}
        yScale={scales.yScale}
        width={width}
        height={height}
      />
    );

    expect(yaxis).to.exist;

    // Will have as many line elements as tickValues
    var yAxisLines = TestUtils.scryRenderedDOMComponentsWithTag(
    yaxis, 'line');
    expect(yAxisLines).to.have.length(tickValues.length);

    var xaxis = TestUtils.renderIntoDocument(
      <XAxis
        xAxisTickValues={tickValues}
        data={allData.allValues}
        xScale={scales.xScale}
        width={width}
        height={height}
      />
    );

    expect(xaxis).to.exist;

    // Will have as many line elements as tickValues
    var xAxisLines = TestUtils.scryRenderedDOMComponentsWithTag(
    xaxis, 'line');
    expect(xAxisLines).to.have.length(tickValues.length);

  });
});
