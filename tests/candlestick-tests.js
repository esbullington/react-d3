'use strict';

var expect = require('chai').expect;  

describe('CandleStickChart', function() {
  it('renders single candlestick chart', function() {
    var React = require('react/addons');
    var CandleStickChart = require('../src/candlestick').CandleStickChart;
    var generate = require('../utils/datagen').generateArrayOfTimeOHLCObjects;
    var TestUtils = React.addons.TestUtils;

    // Render a areachart using single-series data object
    var length = 5;
    var data = {
      name: 'blah',
      values: generate(length)
    };

    var candlestick = TestUtils.renderIntoDocument(
      <CandleStickChart
        data={data}
        width={500}
        height={400}
        // xAxisTickInterval={{unit: 'month', interval: 1}}
        title="Candlestick Chart" />
    );

    // Verify that it has the same number of areas as the data's length
    var candlestick = TestUtils.findRenderedDOMComponentWithClass(
      candlestick, 'rd3-candlestick');
    var candles = TestUtils.scryRenderedDOMComponentsWithClass(candlestick, "rd3-candles");
    var wicks = TestUtils.scryRenderedDOMComponentsWithClass(candlestick, "rd3-wicks");
    expect(candles).have.length(1);
    expect(wicks).have.length(1);

    expect(Object.keys(candles[0]._renderedChildren)).have.length(length);
    expect(Object.keys(wicks[0]._renderedChildren)).have.length(length);

  });
});
