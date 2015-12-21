'use strict';

var expect = require('chai').expect;
var React = require('react/addons');
var LineChart = require('../src/linechart').LineChart;
var generate = require('./utils/datagen').generateArrayOfPoints;
var TestUtils = React.addons.TestUtils;
var data, linechart;
var length = 5;

describe('LineChart', function() {
  before(function() {
    // Render a linechart
    data = [
      {
        name: "series1",
        values: generate(length)
      },
      {
        name: "series2",
        values: generate(length)
      }
    ];
    linechart = TestUtils.renderIntoDocument(
      <LineChart data={data} width={400} height={200} />
    );

  });

  it('renders multi-series linechart with array of objects data', function() {
    // Verify that it has the same number of path as the array's length
    var paths = TestUtils.scryRenderedDOMComponentsWithClass(
      linechart, 'rd3-linechart-path');
    expect(paths).to.have.length(Object.keys(data).length);

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      linechart, 'rd3-linechart-circle');
    expect(circles).to.have.length(Object.keys(data).length * length);
  });

  it('render tooltip when circle animates', function() {
      var circle = TestUtils.scryRenderedDOMComponentsWithClass(
        linechart, 'rd3-linechart-circle')[0];

      // Before animation
      expect(linechart.state.tooltip.show).to.equal(false);

      // Animation starts with hover
      TestUtils.Simulate.mouseOver(circle);
      expect(linechart.state.tooltip.show).to.equal(true);
  });
});
