'use strict';

var expect = require('chai').expect;

describe('ScatterChart', function() {
  it('renders scatterchart', function() {
    var React = require('react/addons');
    var ScatterChart = require('../src/scatterchart').ScatterChart;
    var generate = require('../utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var points = 5;

    // Render a scatterchart using array data
    var data = {
      series1: generate(points),
      series2: generate(points)
    };
    var scatterchart = TestUtils.renderIntoDocument(
      <ScatterChart data={data} width={400} height={200} />
    );

    var circles = TestUtils.scryRenderedDOMComponentsWithTag(
      scatterchart, 'circle');
    expect(circles).to.have.length(2 * points);
  });
});
