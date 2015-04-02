'use strict';

var expect = require('chai').expect;

describe('Voronoi', function() {
  it('renders and tests voronoi component', function() {
    var React = require('react/addons');
    var Voronoi = require('../src/common/Voronoi');
    var generate = require('./utils/datagen').generateArrayOfPoints;
    var TestUtils = React.addons.TestUtils;
    var utils = require('../src/utils');

    var points = 5,
        width = 300,
        height = 200;

    var data = [
      {
        name: "series1",
        values: generate(5)
      },
      {
        name: "series2",
        values: generate(5)
      }
    ];

    var xAccessor = (d) => d.x;
    var yAccessor = (d) => d.y;

    var allData = utils.flattenData(data, xAccessor, yAccessor);
    var scales = utils.calculateScales(width, height, allData.xValues, allData.yValues);
    
    var voronoi = TestUtils.renderIntoDocument(
      <Voronoi
        data={allData.allValues}
        xScale={scales.xScale}
        yScale={scales.yScale}
        width={width}
        height={height}
      /> 
    );
    
   var regions = TestUtils.scryRenderedDOMComponentsWithTag(
    voronoi, 'path');
  expect(regions).to.have.length(2 * points);

  });
});
