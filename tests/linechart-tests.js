/** @jsx React.DOM */

var expect = require('chai').expect;  

describe('LineChart', function() {
  it('renders linechart', function() {
    var React = require('react/addons');
    var LineChart = require('../src/linechart.js').LineChart;
    var Bar = require('../src/linechart.js').Bar;
    var generate = require('../utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    // Render a linechart using array data
    var data = generate(5);
    var linechart = TestUtils.renderIntoDocument(
      <LineChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of bars as the array's length
    var path = TestUtils.findRenderedDOMComponentWithTag(
      linechart, 'path');
    expect(path).to.exist;
  });
});
