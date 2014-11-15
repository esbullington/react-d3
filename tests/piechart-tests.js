/** @jsx React.DOM */

var expect = require('chai').expect;  
var _ = require('lodash');

describe('PieChart', function() {
  it('renders piechart', function() {
    var React = require('react/addons');
    var PieChart = require('../src/piechart.js').PieChart;
    var Pie = require('../src/piechart.js').Pie;
    var generatePartsOfWhole = require('../utils/datagen').generatePartsOfWhole;;
    var TestUtils = React.addons.TestUtils;

    // Render a piechart using array data
    var data = generatePartsOfWhole();
    var piechart = TestUtils.renderIntoDocument(
      <PieChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of pies as the array's length
    var pie = TestUtils.findRenderedDOMComponentWithTag(
      piechart, 'svg');
    expect(pie).to.exist;
  });
});
