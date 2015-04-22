'use strict';

var expect = require('chai').expect;

describe('LegendChart', function() {
  it('renders and tests LegendChart component', function() {
    var React = require('react/addons');
    var LegendChart = require('../src/common/charts/LegendChart');
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    var legend = TestUtils.renderIntoDocument(
      <LegendChart /> 
    );

    var legendWithTitle = TestUtils.renderIntoDocument(
      <LegendChart title="foo" /> 
    );

    // Verify there is no heading element
    var noTitleHeadings = TestUtils.scryRenderedDOMComponentsWithTag(
      legend, 'h4');
    expect(noTitleHeadings).to.have.length(0);

    // Verify there is a heading element
    var titleHeadings = TestUtils.scryRenderedDOMComponentsWithTag(
      legendWithTitle, 'h4');
    expect(titleHeadings).to.have.length(1);
  });
});
