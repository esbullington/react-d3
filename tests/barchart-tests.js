'use strict';

var expect = require('chai').expect;  

describe('BarChart', function() {
  it('renders barchart', function() {
    var React = require('react/addons');
    var BarChart = require('../src/barchart').BarChart;
    var generate = require('../utils/datagen').generateArrayOfNumbers;
    var TestUtils = React.addons.TestUtils;

    // Render a barchart using array data
    var data = generate(5);
    var barchart = TestUtils.renderIntoDocument(
      <BarChart data={data} width={400} height={200} />
    );

    // Verify that it has rendered the main chart svg
    var svg = TestUtils.findRenderedDOMComponentWithTag(
      barchart, 'svg');
    expect(svg).to.exist;

    // Verify that it has the same number of bars as the array's length
    var bars = TestUtils.scryRenderedDOMComponentsWithTag(
      barchart, 'rect');
    expect(bars.length).to.equal(data.length);
  });
});
