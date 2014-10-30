/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var BarChart = require('../src/barchart').BarChart;
var LineChart = require('../src/linechart').LineChart;
var PieChart = require('../src/piechart').PieChart;
var datagen = require('../utils/datagen');


var Demos = React.createClass({
  render: function() {
    var lineData = datagen.generateArrayOfPoints(10);
    var barData = datagen.generateArrayOfNumbers(5);
    var pieData = datagen.generateArrayOfNumbers(5);
    return (
      <div>
        <LineChart data={lineData} width={400} height={200} />
        <hr/>
        <BarChart data={barData} width={400} height={200} />
        <hr/>
        <PieChart data={pieData} width={400} height={400} radius={200} innerRadius={60}  />
      </div>
    );
  }

});

React.renderComponent(
  <Demos />,
  document.body
);
