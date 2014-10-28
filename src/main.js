/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var BarChart = require('./barchart').BarChart;
var LineChart = require('./linechart').LineChart;
var datagen = require('../utils/datagen');


var Demos = React.createClass({
  render: function() {
    var lineData = datagen.generateArrayOfPoints(10);
    var barData = datagen.generateArrayOfNumbers(5);
    return (
      <div>
        <LineChart data={lineData} width={400} height={200} />
        <hr/>
        <BarChart data={barData} width={400} height={200} />
      </div>
    );
  }

});

React.renderComponent(
  <Demos />,
  document.body
);
