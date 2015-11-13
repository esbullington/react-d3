'use strict';

var expect = require('chai').expect;
var React = require('react/addons');
var { CandlestickChart } = require('../src/candlestick');
var { generateArrayOfTimeOHLCObjects: generate } = require('./utils/datagen');

var TestUtils = React.addons.TestUtils;
var length = 5;
var data, candlestickChart, candlestickChartWithoutAnimation;  

var CHART_CLASS_NAME  = 'rd3-candlestick';
var CHART_WO_ANIMATION_CLASS_NAME = 'rd3-candlestick-wo-animation';
var CANDLE_CLASS_NAME = 'rd3-candlestick-candle';
var WICK_CLASS_NAME = 'rd3-candlestick-candle';

describe('CandlestickChart', function() {

  before(function() {
    data = [
      {
        name: 'series1',
        values: generate(length)
      },
      {
        name: 'series2',
        values: generate(length)
      }
    ];

    candlestickChart = TestUtils.renderIntoDocument(
      <CandlestickChart
        data={data}
        width={400}
        height={200}
        title="Candlestick Chart"
      />
    );

    candlestickChartWithoutAnimation = TestUtils.renderIntoDocument(
      <CandlestickChart
        data={data}
        width={400}
        height={200}
        hoverAnimation={false}
        className={CHART_WO_ANIMATION_CLASS_NAME}
        title="Candlestick Chart Without Animation"
      />
    );

  });

  it('renders candlestick chart', function() {

    var candlestickGroup = TestUtils.findRenderedDOMComponentWithClass(
      candlestickChart, 'rd3-candlestick');
    expect(candlestickGroup).to.exist;
    expect(candlestickGroup.tagName).to.equal('g');
  });

  it('renders same amount of wicks and candles with data', function() {
    
    var wicks = TestUtils.scryRenderedDOMComponentsWithClass(candlestickChart, WICK_CLASS_NAME);
    var candles = TestUtils.scryRenderedDOMComponentsWithClass(candlestickChart, CANDLE_CLASS_NAME );

    expect(wicks).have.length(Object.keys(data).length * length);
    expect(candles).have.length(Object.keys(data).length * length);
  });

  it('candle animates correctly', function() {
    var candle = TestUtils.scryRenderedDOMComponentsWithClass(
      candlestickChart, CANDLE_CLASS_NAME)[0];

    // circle properties before hovered
    var candleColor  = candle.props.fill;
    var candleWidth  = candle.props.width;

    // Before animation
    expect(candle.props.fill).to.equal(candleColor);
    expect(candle.props.width).to.equal(candleWidth);

    // Animation starts with hover
    TestUtils.Simulate.mouseOver(candle);
    expect(candle.props.fill).to.not.equal(candleColor);
    expect(candle.props.width).to.not.equal(candleWidth);

    // TestUtils.Simulate.mouseOut(candle) is not working here
    // https://github.com/facebook/react/issues/1297
    // Animation ends with end of hover
    TestUtils.SimulateNative.mouseOut(candle);
    expect(candle.props.fill).to.equal(candleColor);
    expect(candle.props.width).to.equal(candleWidth);
  });

  it('renders candlestick chart with custom className', function() {

    var candlestickGroup = TestUtils.findRenderedDOMComponentWithClass(
      candlestickChartWithoutAnimation, CHART_WO_ANIMATION_CLASS_NAME);
    expect(candlestickGroup).to.exist;
    expect(candlestickGroup.tagName).to.equal('g');
  });

  it('candle does not animate since hoverAnimation is set to false', function() {
    var candle = TestUtils.scryRenderedDOMComponentsWithClass(
      candlestickChartWithoutAnimation, CANDLE_CLASS_NAME)[0];

    var candleColor  = candle.props.fill;
    var candleWidth  = candle.props.width;

    expect(candle.props.fill).to.equal(candleColor);
    expect(candle.props.width).to.equal(candleWidth);

    TestUtils.Simulate.mouseOver(candle);
    expect(candle.props.fill).to.equal(candleColor);
    expect(candle.props.width).to.equal(candleWidth);

  });

});
