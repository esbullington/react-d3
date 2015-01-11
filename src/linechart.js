/** @jsx React.DOM */
var React = require('react');
var d3 = require('d3');
var Chart = require('./common').Chart;


var Line = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    strokeWidth: React.PropTypes.number,
    path: React.PropTypes.string,
    fill: React.PropTypes.string,
    stroke: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      stroke: '#1f77b4',
      fill: 'none'
    };
  },

  render: function() {
    return (
      <path
        d={this.props.path}
        stroke={this.props.stroke}
        fill={this.props.fill}
        strokeWidth={this.props.strokeWidth}
      />
    );
  }

});

var Circle = React.createClass({

  propTypes: {
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    r: React.PropTypes.number,
    fill: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      fill: '#1f77b4'
    }
  },

  render: function() {
    return (
      <circle
        cx={this.props.cx}
        cy={this.props.cy}
        r={this.props.r}
        fill={this.props.fill}
      />
    );
  }

});

var XAxis = React.createClass({

  componentWillReceiveProps: function(props) {
    this._renderAxis(props);
  },

  render: function() {
    var t = "translate(0," + this.props.height + ")"
    return (
      <g
        ref='linexaxis'
        className="linex axis"
        transform={t}
      >
      </g>
    );
  },

  componentDidMount: function() {
    this._renderAxis(this.props);
  },

  _renderAxis: function(props) {
    var xAxis = d3.svg.axis()
      .scale(props.scaleX)
      .orient("bottom");

    var node = this.refs.linexaxis.getDOMNode();

    d3.select(node)
      .attr("class", "linex axis")
      .style("fill", props.color)
      .call(xAxis);

    // Style each of the tick lines
    var lineXAxis = d3.select('.linex.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", props.color);

    // Style the main axis line
    d3.select('.linex.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", props.color)
      .attr("stroke-width", "1");

    // Hides the x axis origin
    d3.selectAll(".linex.axis g:first-child").style("opacity","0");
  }

});


var YAxis = React.createClass({

  componentWillReceiveProps: function(props) {
    this._renderAxis(props);
  },

  render: function() {
    return (
      <g
        ref='lineyaxis'
        className="liney axis"
      >
      </g>
    );
  },

  componentDidMount: function() {
    this._renderAxis(this.props);
  },

  _renderAxis: function(props) {
    var yAxis = d3.svg.axis()
      .ticks(props.yAxisTickCount)
      .scale(props.scaleY)
      .orient("left");

    var node = this.refs.lineyaxis.getDOMNode();

    d3.select(node)
      .attr("class", "liney axis")
      .style("fill", props.color)
      .call(yAxis);

    // Style each of the tick lines
    d3.selectAll('.liney.axis')
      .selectAll('line')
      .attr("shape-rendering", "crispEdges")
      .attr("stroke", props.color);

    // Style the main axis line
    d3.selectAll('.liney.axis')
      .select('path')
      .attr("shape-rendering", "crispEdges")
      .attr("fill", "none")
      .attr("stroke", props.color)
  }

});

var DataSeries = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    interpolate: React.PropTypes.string,
    color: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      data: [],
      interpolate: 'linear',
      color: '#fff'
    }
  },

  render: function() {
    var self = this;
    var interpolatePath = d3.svg.line()
        .x(function(d) {
          return self.props.scaleX(d.x);
        })
        .y(function(d) {
          return self.props.scaleY(d.y);
        })
        .interpolate(this.props.interpolate);

    var circles = [];

    this.props.data.forEach(function(point, i) {
      circles.push(<Circle cx={this.props.scaleX(point.x)} cy={this.props.scaleY(point.y)} r={this.props.pointRadius} fill={this.props.color} key={this.props.seriesName + i} />);
    }.bind(this));

    return (
      <g>
        <Line path={interpolatePath(this.props.data)} stroke={this.props.color} />
        {circles}
      </g>
    )
  }

});

var LineChart = React.createClass({

  propTypes: {
    margins: React.PropTypes.object,
    pointRadius: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    axesColor: React.PropTypes.string,
    title: React.PropTypes.string,
    colors: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      margins: {top: 20, right: 30, bottom: 30, left: 30},
      pointRadius: 3,
      width: 400,
      height: 200,
      axesColor: '#000',
      title: '',
      colors: d3.scale.category20c()
    }
  },

  getInitialState: function() {
    return {
      maxX: 0,
      maxY: 0,
      chartWidth: 0,
      chartHeight: 0
    }
  },

  componentWillMount: function() {
    this._calculateState();
  },

  render: function() {
    var dataSeriesArray = [];
    var index = 0;

    for(var seriesName in this.props.data) {
      if (this.props.data.hasOwnProperty(seriesName)) {
        dataSeriesArray.push(
            <DataSeries
              scaleX={this.state.scaleX}
              scaleY={this.state.scaleY}
              seriesName={seriesName}
              data={this.props.data[seriesName]}
              width={this.state.chartWidth}
              height={this.state.chartHeight}
              color={this.props.colors(index)}
              pointRadius={this.props.pointRadius}
              key={seriesName}
            />
        )
        index++;
      }
    }

    var trans = "translate(" + this.props.margins.left + "," + this.props.margins.top + ")"

    return (
      <Chart width={this.props.width} height={this.props.height} title={this.props.title}>
        <g transform={trans}>
          {dataSeriesArray}
          <YAxis
            scaleY={this.state.scaleY}
            margins={this.props.margins}
            yAxisTickCount={this.props.yAxisTickCount}
            width={this.state.chartWidth}
            height={this.state.chartHeight}
            color={this.props.axesColor}
          />
          <XAxis
            scaleX={this.state.scaleX}
            data={this.props.data}
            margins={this.props.margins}
            width={this.state.chartWidth}
            height={this.state.chartHeight}
            color={this.props.axesColor}
          />
        </g>
      </Chart>
    );
  },

  _calculateState: function() {

    var maxY = 0,
        maxX = 0;

    for(var series in this.props.data) {
      var seriesMaxY = d3.max(this.props.data[series], function(d) {
        return d.y;
      });

      var seriesMaxX = d3.max(this.props.data[series], function(d) {
        return d.x;
      });

      maxX = (seriesMaxX > maxX) ? seriesMaxX : maxX;
      maxY = (seriesMaxY > maxY) ? seriesMaxY : maxY;
    }

    var chartWidth = this.props.width - this.props.margins.left - this.props.margins.right;
    var chartHeight = this.props.height - this.props.margins.top - this.props.margins.bottom;

    var scaleX = d3.scale.linear()
      .domain([0, maxX])
      .range([0, chartWidth]);

    var scaleY = d3.scale.linear()
      .domain([0, maxY])
      .range([chartHeight, 0]);

    this.setState({
      maxX: maxX,
      maxY: maxY,
      scaleX: scaleX,
      scaleY: scaleY,
      chartWidth: chartWidth,
      chartHeight: chartHeight
    })
  }

});

exports.LineChart = LineChart;
