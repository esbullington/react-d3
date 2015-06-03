'use strict';

var expect = require('chai').expect;

describe('Legend', function() {
  it('renders and tests legend component', function() {
    var React = require('react/addons');
    var Legend = require('../src/common/Legend');
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    // Render a linechart using array data
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

    var legend = TestUtils.renderIntoDocument(
      <Legend
        data={data}
        margins={{top: 10, right: 20, bottom: 30, left: 30}}
        width={90}
      />
    );

    // Verify that legend list exists
    var list = TestUtils.findRenderedDOMComponentWithTag(
      legend, 'ul');
    expect(list).to.exist;

    // Verify that it has the proper number of list items
    var listItems = TestUtils.scryRenderedDOMComponentsWithTag(
      legend, 'li');
    expect(listItems).to.have.length(2);
  });
});
