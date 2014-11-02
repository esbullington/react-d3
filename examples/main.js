/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var BarChart = require('../src/barchart').BarChart;
var LineChart = require('../src/linechart').LineChart;
var PieChart = require('../src/piechart').PieChart;
var AreaChart = require('../src/areachart').AreaChart;
var datagen = require('../utils/datagen');


var Demos = React.createClass({

  getInitialState: function() {
    return {
      areaData: []
    }
  },
  
  componentDidMount: function() {
    // Apple stock data from Mike Bostock's chart at
    // http://bl.ocks.org/mbostock/3883195
    var parseDate = d3.time.format("%d-%b-%y").parse;
    d3.tsv("data/applestock.tsv", function(error, data) {
      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
      });
      this.setState({areaData: data});
    }.bind(this))
  },

  render: function() {

    var lineData = datagen.generateArrayOfPoints(10);
    var barData = datagen.generateArrayOfNumbers(5);
    var pieData = datagen.generateArrayOfNumbers(5);
 
    return (
      <div>
        <hr/>
        <LineChart data={lineData} width={400} height={200} />
        <hr/>
        <BarChart data={barData} width={400} height={200} />
        <hr/>
        <PieChart data={pieData} width={400} height={400} radius={200} innerRadius={60}  />
        <hr/>
        <AreaChart data={this.state.areaData} width={600} height={400} />
      </div>
    );
  }

});

React.render(
  <Demos />,
  document.body
);
