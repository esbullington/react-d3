/** @jsx React.DOM */
var React = require('react');
var pkg = require('../package.json');
var d3 = require('d3');
var BarChart = require('../src/barchart').BarChart;
var LineChart = require('../src/linechart').LineChart;
var PieChart = require('../src/piechart').PieChart;
var AreaChart = require('../src/areachart').AreaChart;
var datagen = require('../utils/datagen');
var hljs = require("highlight.js");

hljs.initHighlightingOnLoad();

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
    var barData = {'A': 5, 'B': 6, 'C': 2, 'D': 11, 'E': 2, 'F': 7};
    var pieData = [{label: "Margarita", value: 20.0}, {label: "John", value: 55.0}, {label: "Tim", value: 25.0 }];
 
    return (
      <div className="container">
        <a href="https://github.com/esbullington/react-d3"><img style={{position: "absolute", top: "0", right: "0", border: "0"}} src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" /></a>
        <h2 className="page-header">
          react-d3
        </h2>
        <div className="row">
          <div className="col-md-6">
            <BarChart data={barData} width={500} height={200} />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {"var barData = {'A': 5, 'B': 6, 'C': 2, 'D': 11, 'E': 2, 'F': 7};"}
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {"<BarChart data={barData} width={500} height={200} fill={'cornflowerblue'} />"}
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <PieChart data={pieData} width={450} height={400} radius={110} innerRadius={20}  />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {' var pieData = [{label: "Margarita", value: 20.0}, {label: "John", value: 55.0}, {label: "Tim", value: 25.0 }]'}
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {'<PieChart\n  data={pieData}\n  width={400}\n  height={400}\n  radius={100}\n  innerRadius={20}\n/>'}
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <LineChart data={lineData} width={400} height={200} />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {'//Sample data format (not actually rendered)\nvar lineData = [\n  { x: 0, y: 95.2687838114798 },\n  { x: 1, y: 77.65943023841828 }\n  ...\n  { x: 4, y: 87.52988900523633 }\n]'}
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
              {'<LineChart data={lineData} width={400} height={200} />'}
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <AreaChart
              data={this.state.areaData}
              width={400}
              height={300}
              yAxisTickCount={4}
              xAxisTickInterval={{unit: 'year', interval: 1}}
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {'//Sample data format (not actually rendered)\n//for actual data, see Apple stock data from Mike Bostock\'s chart:\n// http://bl.ocks.org/mbostock/3883195\nvar areaData = [\n  {date: 1177646400000, value: 582.13},\n  ...\n  {date: 1178078400000, value: 603}\n]'}
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {'<AreaChart\n  data={areaData}\n  width={400}\n  height={300}\n  yAxisTickCount={4}\n  xAxisTickInterval={{unit: "year", interval: 1}}\n/>'}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

});

React.render(
  <Demos />,
  document.body
);
