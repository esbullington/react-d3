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
    var data = [
      {
        name: 'series1',
        values: generate(length)
      },
      {
        name: 'series2',
        values: generate(length)
      }
    ];

    var candlestickChart = TestUtils.renderIntoDocument(
      <CandleStickChart
        data={data}
        width={500}
        height={400}
        // xAxisTickInterval={{unit: 'month', interval: 1}}
        title="Candlestick Chart" />
    );

    var candlestickGroup = TestUtils.findRenderedDOMComponentWithClass(
      candlestickChart, 'rd3-candlestick');
    expect(candlestickGroup).to.exist;

    var wicks = TestUtils.scryRenderedDOMComponentsWithClass(candlestickChart, 'rd3-candlestick-line');
    var candles = TestUtils.scryRenderedDOMComponentsWithClass(candlestickChart, 'rd3-candlestick-rect');

    expect(wicks).have.length(Object.keys(data).length * length);
    expect(candles).have.length(Object.keys(data).length * length);

  });
});
