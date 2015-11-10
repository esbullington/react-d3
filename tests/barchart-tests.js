'use strict';

var expect = require('chai').expect;

describe('BarChart', function() {
  it('renders barchart', function() {
    var React = require('react/addons');
    var BarChart = require('../src/barchart').BarChart;
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var length = 5;

    var data = [
      {
        name: "series1",
        values: generate(length)
      },
      {
        name: "series2",
        values: generate(length)
      }
    ];

    // Render a barchart using array data
    var barchart = TestUtils.renderIntoDocument(
      <BarChart data={data} width={400} height={200} />
    );

    // Verify that it has rendered the main chart svg
    var barchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      barchart, 'rd3-barchart');
    expect(barchartGroup).to.exist;
    expect(barchartGroup.tagName).to.equal('g');

    // Verify that it has the same number of bars as the array's length
    var bars = TestUtils.scryRenderedDOMComponentsWithTag(
      barchart, 'rect');
    expect(bars.length).to.equal(data.length * length);
  });

  it('renders barchart with negative values', function() {
    var React = require('react/addons');
    var BarChart = require('../src/barchart').BarChart;
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    var length = 5;

    var data = [
      {
        name: "series1",
        values: generate(length)
      },
      {
        name: "series2",
        values: generate(length)
      }
    ];

    // Set a few values to negative numbers
    data[0].values[1]['y'] = -100;
    data[1].values[3]['y'] = -150;

    var barchart = TestUtils.renderIntoDocument(
      <BarChart data={data} width={400} height={200} />
    );

    // Verify that it has rendered the main chart svg
    var barchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      barchart, 'rd3-barchart');
    expect(barchartGroup).to.exist;
    expect(barchartGroup.tagName).to.equal('g');

    // Verify that it has the same number of bars as the array's length
    var bars = TestUtils.scryRenderedDOMComponentsWithTag(
      barchart, 'rect');
    expect(bars.length).to.equal(data.length * length);
  });
});
