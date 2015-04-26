'use strict';

var expect = require('chai').expect;

describe('BasicChart', function() {
  it('renders and tests BasicChart component', function() {
    var React = require('react/addons');
    var BasicChart = require('../src/common/charts/BasicChart');
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;

    var chart = TestUtils.renderIntoDocument(
      <BasicChart /> 
    );

    var chartWithTitle = TestUtils.renderIntoDocument(
      <BasicChart title="foo" /> 
    );

    // Verify there is no heading element
    var noTitleHeadings = TestUtils.scryRenderedDOMComponentsWithTag(
      chart, 'h4');
    expect(noTitleHeadings).to.have.length(0);

    // Verify there is a heading element
    var titleHeadings = TestUtils.scryRenderedDOMComponentsWithTag(
      chartWithTitle, 'h4');
    expect(titleHeadings).to.have.length(1);
  });
});

