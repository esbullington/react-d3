/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var BarChart = require('../src/barchart').BarChart;
var LineChart = require('../src/linechart').LineChart;
var datagen = require('../utils/datagen');


var Demos = React.createClass({
  render: function() {
    var lineData = datagen.generateArrayOfPoints(10);
    var barData = [];
    var i;
    for (i = 0; i < 5; i++) {
      barData.push(datagen.generateArrayOfNumbers(5));
    }
    console.log('barData: ', barData);
    var barChart = [];
    barData.forEach(function(data, idx) {
      barChart.push(<BarChart data={barData[0]} width={400} height={200} transitionName={"example"} />);
    });
    return (
      <div>
        <LineChart data={lineData} width={400} height={200} />
        <hr/>
        <BarChart data={datagen.generateArrayOfNumbers(5)} width={400} height={200} transitionName="example" />
      </div>
    );
  }

});

React.renderComponent(
  <Demos />,
  document.body
);
