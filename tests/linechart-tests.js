'use strict';

var expect = require('chai').expect;

describe('LineChart', function() {
  it('renders linechart property with object data', function() {
    var React = require('react/addons');
    var LineChart = require('../src/linechart').LineChart;
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    // Render a linechart using array data
    var data = {
      name: 'blah',
      values: generate(5)
    };

    var linechart = TestUtils.renderIntoDocument(
      <LineChart data={data} width={400} height={200} />
    );

    var linechartGroup = TestUtils.findRenderedDOMComponentWithClass(
      linechart, 'rd3-linechart');
    expect(linechartGroup).to.exist;
    expect(linechartGroup.tagName).to.equal('G');

    // Verify that it has the same number of bars as the array's length
    var paths = TestUtils.scryRenderedDOMComponentsWithClass(
      linechart, 'rd3-linechart-path');
    expect(paths).to.have.length(1);

  });
  it('renders multi-series linechart with array of objects data', function() {
    var React = require('react/addons');
    var LineChart = require('../src/linechart').LineChart;
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var length = 5;

    // Render a linechart using array data
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
    var linechart = TestUtils.renderIntoDocument(
      <LineChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of path as the array's length
    var paths = TestUtils.scryRenderedDOMComponentsWithClass(
      linechart, 'rd3-linechart-path');
    expect(paths).to.have.length(Object.keys(data).length);

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      linechart, 'rd3-linechart-circle');
    expect(circles).to.have.length(Object.keys(data).length * length);
  });
});
