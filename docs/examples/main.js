'use strict';

var React = require('react');
var d3 = require('d3');
var hljs = require("highlight.js");
var rd3 = require('../../src');
var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;
var CandlestickChart = rd3.CandlestickChart;
var PieChart = rd3.PieChart;
var AreaChart = rd3.AreaChart;
var Treemap = rd3.Treemap;
var ScatterChart= rd3.ScatterChart;

hljs.initHighlightingOnLoad();

var Demos = React.createClass({

  getInitialState: function() {
    return {
      areaData: [],
      ohlcData: []
    }
  },

  componentWillMount: function() {
    // Browser data adapted from nvd3's stacked area data
    // http://nvd3.org/examples/stackedArea.html
    var parseDate = d3.time.format("%y-%b-%d").parse;
    d3.json("data/stackedAreaData.json", function(error, data) {
      this.setState({areaData: data});
    }.bind(this));

    d3.tsv("data/AAPL_ohlc.tsv", function(error, data) {
      var series = { name: "AAPL", values: [] };

      data.map(function(d) {
        d.date = new Date(+d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        series.values.push({ x: d.date, open: d.open, high: d.high, low: d.low, close: d.close});
      });
      this.setState({ ohlcData: [series] });
    }.bind(this));
  },

  render: function() {

    var lineData = [
      { 
        name: 'series1',
        values: [ { x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 } ],
        strokeWidth: 3,
        strokeDashArray: "5,5",
      },
      {
        name: 'series2',
        values : [ { x: 0, y: 8 }, { x: 1, y: 5 }, { x: 2, y: 20 }, { x: 3, y: 12 }, { x: 4, y: 4 }, { x: 5, y: 6 }, { x: 6, y: 2 } ]
      },
      {
        name: 'series3',
        values: [ { x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 2 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 2 } ]
      } 
    ];

    var barData = [
      {
        "name": "Series A",
        "values": [
          { "x": 1, "y":  91},
          { "x": 2, "y": 290},
          { "x": 3, "y": -25},
        ]
      },
      {  
        "name": "Series B",
        "values": [
          { "x": 1, "y":  9},
          { "x": 2, "y": 49},
          { "x": 3, "y": -20},
        ]
      },
      {  
        "name": "Series C",
        "values": [
          { "x": 1, "y":  14},
          { "x": 2, "y": 77},
          { "x": 3, "y": -70},
        ]
      }
    ];

    var pieData = [{label: "Margarita", value: 20.0}, {label: "John", value: 55.0}, {label: "Tim", value: 25.0 }];

    // 2014 Most Populous Countries
    // http://www.prb.org/pdf14/2014-world-population-data-sheet_eng.pdf
    var treemapData = [{label: 'China', value: 1364}, {label: 'India', value: 1296}, {label: 'United States', value: 318}, {label: 'Indonesia', value: 251}, {label: 'Brazil', value: 203}];

    var scatterData = [
      {
        name: "series1",
        values: [ { x: 0, y: 20 }, { x: 5, y: 7 }, { x: 8, y: 3 }, { x: 13, y: 33 }, { x: 12, y: 10 }, { x: 13, y: 15 }, { x: 24, y: 8 }, { x: 25, y: 15 }, { x: 16, y: 10 }, { x: 16, y: 10 }, { x: 19, y: 30 }, { x: 14, y: 30 }]
      },
      {
        name: "series2",
        values: [ { x: 40, y: 30 }, { x: 35, y: 37 }, { x: 48, y: 37 }, { x: 38, y: 33 }, { x: 52, y: 60 }, { x: 51, y: 55 }, { x: 54, y: 48 }, { x: 45, y: 45 }, { x: 46, y: 50 }, { x: 66, y: 50 }, { x: 39, y: 36 }, { x: 54, y: 30 }]
      },
      {
        name: "series3",
        values: [ { x: 80, y: 78 }, { x: 71, y: 58 }, { x: 78, y: 68 }, { x: 81, y: 47 },{ x: 72, y: 70 }, { x: 70, y: 88 }, { x: 81, y: 90 }, { x: 92, y: 80 }, { x: 81, y: 72 }, { x: 99, y: 95 }, { x: 67, y: 81 }, { x: 96, y: 78 }]
      }
    ];

    return (
      <div className="container">
        <a href="https://github.com/esbullington/react-d3"><img style={{position: "absolute", top: "0", right: "0", border: "0"}} src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" /></a>
        <div className="row">
          <h3 className="page-header">react-d3: Multiple series charts</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <LineChart
              legend={true}
              data={lineData}
              width='100%'
              height={400}
              viewBoxObject={{
                x: 0,
                y: 0,
                width: 500,
                height: 400
              }}
              title="Line Chart"
              yAxisLabel="Altitude"
              xAxisLabel="Elapsed Time (sec)"
              domain={{x: [,10], y: [-10,]}}
              gridHorizontal={true}
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var lineData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, ..., { x: 24, y: 10 } ],
    strokeWidth: 3,
    strokeDashArray: "5,5",
  },
  ....
  {
    name: "series2",
    values: [ { x: 70, y: 82 }, ..., { x: 76, y: 82 } ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
              {
`<LineChart
  legend={true}
  data={lineData}
  width='100%'
  height={400}
  viewBoxObject={{
    x: 0,
    y: 0,
    width: 500,
    height: 400
  }}
  title="Line Chart"
  yAxisLabel="Altitude"
  xAxisLabel="Elapsed Time (sec)"
  domain={{x: [,10], y: [-10,]}}
  gridHorizontal={true}
/>`
              }
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <ScatterChart
              data={scatterData} width={500} height={400} title="Scatter Chart" domain={{x:[-15,], y:[-15,]}}/>
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var scatterData = [
  {
    name: "series1",
    values: [ { x: 0, y: 20 }, ..., { x: 24, y: 10 } ]
  },
  ....
  {
    name: "series3",
    values: [ { x: 70, y: 82 }, ..., { x: 76, y: 82 } ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
              {
`<ScatterChart
  data={scatterData}
  width={500}
  height={400}
  domain={{y: [-15,], y: [-15,]}}
  title="Scatter Chart"
/>`
              }
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
              width="100%"
              viewBoxObject={{
                x: 0,
                y: 0,
                height: 400,
                width: 500
              }}
              height={400}
              title="Area Chart"
              xAxisTickInterval={{unit: 'year', interval: 2}}
              xAxisLabel="Year"
              yAxisLabel="Share Price"
              xAccessor={(d)=> {
                  return new Date(d[0]);
                }
              }
              yAccessor={(d)=>d[1]}
              domain={{y: [,60]}}
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var areaData = [
  {
    name: "series1",
    values: [ { x: [object Date], y: 20.5 }, ..., { x: [object Date], y: 4.2 } ]
  },
  ...
  {
    name: "series2",
    values: [ { x: [object Date], y: 3.2 }, ..., { x: [object Date], y: 11.2 } ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {
`<AreaChart
  data={areaData}
  width="100%"
  height={300}
  viewBoxObject={{
    x: 0,
    y: 0,
    height: 400,
    width: 500
  }}
  domain={{y: [,60]}}
  xAxisTickInterval={{unit: 'year', interval: 2}}
  title="Area Chart"
/>`
                }
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CandlestickChart
              data={this.state.ohlcData}
              width={500}
              height={400}
              yAxisOffset={-10}
              title="Candlestick Chart"
              domain={{y:[400, 500]}}
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var ohlcData = [
  {
    name: "AAPL",
    values: [ { x: [object Date], open: 451.69, high: 456.23, low: 435, close: 439.88 }, 
              { x: [object Date], open: 437.82, high: 453.21, low: 435.86 , close: 449.83 }, 
              ... 
            ]
  }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {
`<CandlestickChart
  data={ohlcData}
  width={500}
  height={400}
  xAxisTickInterval={{unit: 'month', interval: 1}}
  yAxisOffset={-10}
  title="Candlestick Chart"
  domain={{y:[400, 500]}}
/>`
                }
              </code>
            </pre>
          </div>
        </div>
        
        <div className="row">
          <hr/>
        </div>

        <div className="row">
          <div className="col-md-6">
            <BarChart data={barData} width={500} height={300} title="Bar Chart" yAxisLabel="Label" xAxisLabel="Value"/>
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {`var barData = [
  { 
    "name": "Series A",
    "values": [
      { "x": 1, "y":  91},
      ...
  },
  { 
    "name": "Series B",
     "values": [ ... ]
  }
  ...
];`}
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {`<BarChart
  data={barData}
  width={500}
  height={200}
  fill={'#3182bd'}
  title='Bar Chart'
  yAxisLabel='Label'
  xAxisLabel='Value'
/>`}
              </code>
            </pre>
          </div>

        <div className="row">
          <h3 className="page-header">react-d3: Single series charts</h3>
        </div>
       
        </div>

        <div className="row">
          <div className="col-md-6">
            <PieChart data={pieData} width={450} height={400} radius={110} innerRadius={20} sectorBorderColor="white" title="Pie Chart" />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`var pieData = [
  {label: 'Margarita', value: 20.0},
  {label: 'John', value: 55.0},
  {label: 'Tim', value: 25.0 }
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {
`<PieChart
  data={pieData}
  width={400}
  height={400}
  radius={100}
  innerRadius={20}
  sectorBorderColor="white"
  title="Pie Chart"
/>`
                }
              </code>
            </pre>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Treemap
              width={450}
              height={250}
              title="Treemap"
              data={treemapData}
              textColor="#484848"
              fontColor="12px"
              hoverAnimation={false}
            />
          </div>
          <div className="col-md-6">
            <pre ref='block'>
              <code className='js'>
              {
`//2014 World Most Populous Countries (millions)
//http://www.prb.org/pdf14/2014-world-population-data-sheet_eng.pdf
var treemapData = [
  {label: "China", value: 1364},
  {label: "India", value: 1296},
...
  {label: "Brazil", value: 203}
];`
              }
              </code>
            </pre>
            <pre ref='block'>
              <code className='html'>
                {
`<Treemap
  data={treemapData}
  width={450}
  height={250}
  textColor="#484848"
  fontSize="12px"
  title="Treemap"
  hoverAnimation={false}
/>`
                }
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
