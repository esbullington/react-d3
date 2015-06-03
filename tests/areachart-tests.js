'use strict';

var expect = require('chai').expect;

describe('AreaChart', function() {
  it('renders stacked areachart with array of objects data', function() {
    var React = require('react/addons');
    var AreaChart = require('../src/areachart').AreaChart;
    var generate = require('./utils/datagen').generateArrayOfObjects;
    var TestUtils = React.addons.TestUtils;

    // Render a areachart using data in array of objects
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
    var areachart = TestUtils.renderIntoDocument(
      <AreaChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of areas as the array's length
    var areas = TestUtils.scryRenderedDOMComponentsWithClass(
      areachart, 'rd3-areachart-area');
    expect(areas).to.have.length(data.length)

  });
});
