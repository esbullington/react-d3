'use strict';

var expect = require('chai').expect;

describe('ScatterChart', function() {
  it('renders scatterchart', function() {
    var React = require('react/addons');
    var ScatterChart = require('../src/scatterchart').ScatterChart;
    var immstruct = require('immstruct');
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var points = 5;
    var pointRadius = 5;

    var structure = immstruct('scatterChart', { voronoi: {}, voronoiSeries: {}});

    // Render a scatterchart 
    var data = [
      {
        name: "series1",
        values: generate(points)
      },
      {
        name: "series2",
        values: generate(points)
      }
    ];

    var scatterchart = TestUtils.renderIntoDocument(
      <ScatterChart structure={structure} data={data} width={400} height={200} pointRadius={pointRadius} />
    );

    var scatterchartGroup = TestUtils.findRenderedDOMComponentWithClass(
      scatterchart, 'rd3-scatterchart');
    expect(scatterchartGroup).to.exist;
    expect(scatterchartGroup.tagName).to.equal('G');

    var circles = TestUtils.scryRenderedDOMComponentsWithClass(
      scatterchart, 'rd3-scatterchart-circle');
    expect(circles).to.have.length(Object.keys(data).length * points);

    var circleOne = circles[0];
    var circleOneColor = circleOne.props.fill;

    expect(circleOne.props.r).to.equal(pointRadius);
    structure.cursor('voronoi').cursor(circleOne.props.id).update(()=> 'active' );
    expect(circleOne.props.r).to.be.above(pointRadius);
    expect(circleOne.props.fill).to.not.equal(circleOneColor);

    structure.cursor('voronoi').cursor(circleOne.props.id).update(()=> 'inactive' );
    expect(circleOne.props.r).to.equal(pointRadius);
    expect(circleOne.props.fill).to.equal(circleOneColor);
  });
});
