'use strict';

var expect = require('chai').expect;  
var React = require('react/addons');
var PieChart = require('../src/piechart').PieChart;
var generatePartsOfWhole = require('./utils/datagen').generatePartsOfWhole;
var TestUtils = React.addons.TestUtils;

describe('PieChart', function() {

  var data = generatePartsOfWhole();
  var values = data.map( (item) => item.value );

  it('renders piechart', function() {
    // Render a piechart using array data
    var piechart = TestUtils.renderIntoDocument(
      <PieChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of pies as the array's length
    var pie = TestUtils.findRenderedDOMComponentWithClass(
      piechart, 'rd3-piechart');
    expect(pie).to.exist;
    expect(pie.tagName).to.equal('g');

    var pieGroup = TestUtils.findRenderedDOMComponentWithClass(piechart, 'rd3-piechart-pie');
    expect(pieGroup).to.exist;

    var chartSeries = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-arc');
    expect(chartSeries.length).to.equal(values.length);

  });

  it('format value text from valueTextFormatter prop', function() {

    // prefix our value text with $ sign by valueTextFormatter prop
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        valueTextFormatter={val=>'$'+val} 
      />
    );
    
    var formattedValueTexts = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-value');
    expect(formattedValueTexts.length).to.equal(values.length);    
    expect(formattedValueTexts[0].getDOMNode().textContent).to.contain('$');
    
  });

  it('doesnt show inner labels if not specified', function() {
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        showInnerLabels={false}
      />
    );
    
    var labels = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-value');
    expect(labels.length).to.equal(0);    
  });

  it('doesnt show outer labels if not specified', function() {
    var piechart = TestUtils.renderIntoDocument(
      <PieChart 
        data={data} width={400} height={200} 
        showOuterLabels={false}
      />
    );
    
    var labels = TestUtils.scryRenderedDOMComponentsWithClass(piechart, 'rd3-piechart-label');
    expect(labels.length).to.equal(0);    
  });
});
