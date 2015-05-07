'use strict';

var expect = require('chai').expect;
var React = require('react/addons');
var { ScatterChart } = require('../src/scatterchart');
var { generateArrayOfPoints: generate } = require('./utils/datagen');

var TestUtils = React.addons.TestUtils;
var points = 5;
var circleRadius = 5;
var data, scatterchart;

describe('ScatterChart', function() {

  before(function() {
    // Render a scatterchart 
    data = [
      {
        name: "series1",
        values: generate(points)
      },
      {
        name: "series2",
        values: generate(points)
      }
    ];
    scatterchart = TestUtils.renderIntoDocument(
      <ScatterChart data={data} width={400} height={200} circleRadius={circleRadius} />
    );

  })

  it('renders scatter chart', function() {

    var scatterchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      scatterchart, 'rd3-scatterchart');
    expect(scatterchartGroup).to.exist;
    expect(scatterchartGroup.tagName).to.equal('G');

  });

  it('renders same amount of circles with data', function() {

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      scatterchart, 'rd3-scatterchart-circle');
    expect(circles).to.have.length(Object.keys(data).length * points);
  
  });

  it('circle color is different from other series', function() {

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      scatterchart, 'rd3-scatterchart-circle');

    // uses this naive approach because TestUtils does not have
    // something like findRenderedDOMComponentWithProps
    var firstCircle = circles[0],
        secondCircle = circles[1],
        lastCircle = circles[circles.length - 1];
    
    // we know that first and second circle are in same series
    expect(firstCircle.props.fill).to.equal(secondCircle.props.fill);

    // we know that first and last circle are not in same series
    expect(firstCircle.props.fill).to.not.equal(lastCircle.props.fill);

  });

  it('circle is animated when hovered', function() {

      var circle = TestUtils.scryRenderedDOMComponentsWithClass(
        scatterchart, 'rd3-scatterchart-circle')[0];

      // circle color before hovered
      var circleColor = circle.props.fill;

      expect(circle.props.r).to.equal(circleRadius);
      TestUtils.Simulate.mouseOver(circle);
      expect(circle.props.r).to.be.above(circleRadius);
      expect(circle.props.fill).to.not.equal(circleColor);

      // TestUtils.Simulate.mouseOut(circle) is not working here
      // https://github.com/facebook/react/issues/1297
      TestUtils.SimulateNative.mouseOut(circle);
      expect(circle.props.r).to.equal(circleRadius);
      expect(circle.props.fill).to.equal(circleColor);    
  });

});
