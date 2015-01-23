'use strict';

var expect = require('chai').expect;  

describe('AreaChart', function() {
  it('renders areachart', function() {
    var React = require('react/addons');
    var AreaChart = require('../src/areachart').AreaChart;
    var generate = require('../utils/datagen').generateArrayOfNumbers;
    var TestUtils = React.addons.TestUtils;

    // Render a areachart using array data
    var data = generate(5);
    var areachart = TestUtils.renderIntoDocument(
      <AreaChart data={data} width={400} height={200} />
    );

    // Verify that it has the same number of areas as the array's length
    var area = TestUtils.findRenderedDOMComponentWithClass(
      areachart, 'area-path');
    expect(area.props.d).to.exist;
  });
});
