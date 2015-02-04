'use strict';

var expect = require('chai').expect;  

describe('PieChart', function() {
  it('renders piechart', function() {
    var React = require('react/addons');
    var PieChart = require('../src/piechart').PieChart;
    var generatePartsOfWhole = require('../utils/datagen').generatePartsOfWhole;
    var TestUtils = React.addons.TestUtils;

    // Render a piechart using array data
    var data = generatePartsOfWhole();
    var values = data.map( (item) => item.value );

    var piechart = TestUtils.renderIntoDocument(
      <PieChart data={data} width={400} height={200} />
    );


    // Verify that it has the same number of pies as the array's length
    var pie = TestUtils.findRenderedDOMComponentWithTag(
      piechart, 'svg');
    expect(pie).to.exist;

    var pieGroup = TestUtils.findRenderedDOMComponentWithClass(pie, 'pie-group');
    expect(pieGroup).to.exist;

    var chartSeries = TestUtils.scryRenderedDOMComponentsWithClass(pieGroup, 'arc-group');
    expect(chartSeries.length).to.equal(values.length);

  });
});
