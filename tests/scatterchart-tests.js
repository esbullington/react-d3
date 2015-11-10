'use strict';

var expect = require('chai').expect;
var React = require('react/addons');
var { ScatterChart } = require('../src/scatterchart');
var { generateArrayOfPoints: generate } = require('./utils/datagen');

var TestUtils = React.addons.TestUtils;
var points = 5;
var circleRadius = 5;
var data, scatterchart;

var CHART_CLASS_NAME  = 'rd3-scatterchart';
var CIRCLE_CLASS_NAME = 'rd3-scatterchart-circle';

describe('ScatterChart', function() {

  before(function() {
    // Render a scatterchart
    data = [
      {
        name: "series1",
        values: generate(points),
        markerRadius: circleRadius
      },
      {
        name: "series2",
        values: generate(points),
        markerRadius: circleRadius
      }
    ];
    scatterchart = TestUtils.renderIntoDocument(
      <ScatterChart
        data={data}
        width={400}
        height={200}
      />
    );

  })

  it('renders scatter chart', function() {

    var scatterchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      scatterchart, CHART_CLASS_NAME);
    expect(scatterchartGroup).to.exist;
    expect(scatterchartGroup.tagName).to.equal('g');

  });

  it('renders same amount of circles with data', function() {

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      scatterchart, CIRCLE_CLASS_NAME);
    expect(circles).to.have.length(Object.keys(data).length * points);

  });

  it('each series has unique circle color', function() {

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      scatterchart, CIRCLE_CLASS_NAME);

    // uses this naive approach because TestUtils does not have
    // something like findRenderedDOMComponentWithProps
    var firstCircle = circles[0],
        secondCircle = circles[1],
        lastCircle = circles[circles.length - 1];

    // we know that first and second circle are in same series
    expect(firstCircle.getAttribute('fill')).to.equal(secondCircle.getAttribute('fill'));

    // we know that first and last circle are not in same series
    expect(firstCircle.getAttribute('fill')).to.not.equal(lastCircle.getAttribute('fill'));

  });

  it('circle animates correctly', function() {

      var circle = TestUtils.scryRenderedDOMComponentsWithClass(
        scatterchart, CIRCLE_CLASS_NAME)[0];

      // circle properties before hovered
      var circleColor  = circle.getAttribute('fill');

      // Before animation
      expect(circle.getAttribute('r')).to.equal(circleRadius);
      expect(circle.getAttribute('fill')).to.equal(circleColor);

      // Animation starts with hover
      TestUtils.Simulate.mouseOver(circle);
      expect(circle.getAttribute('r')).to.be.above(circleRadius);
      expect(circle.getAttribute('fill')).to.not.equal(circleColor);

      // TestUtils.Simulate.mouseOut(circle) is not working here
      // https://github.com/facebook/react/issues/1297
      // Animation ends with end of hover
      TestUtils.SimulateNative.mouseOut(circle);
      expect(circle.getAttribute('r')).to.equal(circleRadius);
      expect(circle.getAttribute('fill')).to.equal(circleColor);

  });

});
