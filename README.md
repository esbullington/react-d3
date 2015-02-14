## react-d3

[![Join the chat at https://gitter.im/esbullington/react-d3](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/esbullington/react-d3?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Modular ReactJS charts made using d3 chart utilities. Work on project documentation has started [here](https://github.com/esbullington/react-d3/wiki). A few examples of the available charts can be seen below, the others can be [viewed here](http://esbullington.github.io/react-d3-website), side-by-side with the React code that generates the charts.

![react-d3 chart images](https://raw.githubusercontent.com/esbullington/react-d3-website/gh-pages/img/multiseries.png)

**Caution:**  alpha state software. Chart APIs will change. Breaking changes will occur at each minor (0.x) release, until we reach version 1.0.  At that point, we'll closely follow the [semver](http://semver.org/) specification.

[![Build Status](https://travis-ci.org/esbullington/react-d3.svg?branch=master)](https://travis-ci.org/esbullington/react-d3)

### Version
[![npm version](https://badge.fury.io/js/react-d3.png)](https://www.npmjs.com/package/react-d3)

### Basic usage

First, install via `npm`:

`npm install react-d3`

Then, import into your ReactJS project:

`var rd3 = require('react-d3');`

The charts are then available under the `rd3` namespace, which you can then use as shown on the [demonstration page](http://esbullington.github.io/react-d3):

### Available Charts

```
var BarChart = rd3.BarChart;
var LineChart = rd3.LineChart;
var PieChart = rd3.PieChart;
var AreaChart = rd3.AreaChart;
var Treemap = rd3.Treemap;
var ScatterChart = rd3.ScatterChart;
```

For usage, please see [here](http://esbullington.github.io/react-d3-website).  API documentation is also coming online over the coming days.

### JSFiddle
There's a development build available for experimentation on JSFiddle: [http://jsfiddle.net/esbullington/jp9dkh1g/](https://cdn.rawgit.com/esbullington/react-d3/dc92f90910c0b2878d1031428604e2f50ef7bfdd/dist/public/js/react-d3.min.js)

Please note that this build should probably not be used in production, since it bundles all of react-d3's dependencies in a single bundle (this is also the cause of the "Cannot read property 'firstChild' of undefined" error message on the JS console, which occurs when there are two React libraries in the same namespace).

All the react-d3 charts are available in this JSFiddle fork under the global `rd3` namespace.

### Background
Although there have been [several](http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/) [different](http://bl.ocks.org/milroc/d22bbf92231876505e5d) approaches proposed for combining the power of d3 with the flexibility and modularity of ReactJS, the approach I'm using here was inspired by [this blog post](http://10consulting.com/2014/02/19/d3-plus-reactjs-for-charting/) by Ben Smith of [Binary Consulting](http://10consulting.com/).  Basically, it uses React to generate a chart's svg components using stateless React components.

With this approach, ReactJS itself is responsible for the SVG markup.  d3 is used for its tremendous collection of utility functions, such as those that calculate the `path` value for various chart types.

However, I've diverged a bit from this original vision and am storing a bit of state in top-level chart components in order to leverage d3's axis generators, at least until I develop native React chart axes.

### Roadmap

* v0.3.0:
  * Additional charts types:
    - candlestick
    - table
  * Axes labels
  * Tooltips

* v0.4.0:
  * Additional charts types:
    - slopegraphs
  * Pure React axes

* v0.5.0:
  * Data frame animations

### Changelog

####0.2.0:
- Added scatterchart (Thanks @yang-wei!)
- Adopted consistent data format for multi-series chart
- Mouseover animation for both line chart and scatter chart
- Added JSHinting
- Factored out axes
- Added chart legend

####0.1.0:
- Added treemap (Thanks @yang-wei!)
- Restructured project for improved npm compatibility
- Harmonized chart palettes
- Fixed non-initial-render for charts with axes (contributions from @tarrencev and @unbracketed)
- Improved documentation (contribution from @jeffriesen)
- Improved chart APIs (contribution from @wookiehangover)

####0.0.1:
- Initial release with linechart, barchart and areachart follow in subsequent patch updates

### Project sustainability
Please help to support this project by hiring me for your next contract job.  I do:
* custom d3 and/or React visualizations.
* React, AngularJS, or Backbone frontend work.
* backend work in Python(Flask, Django), Lua(w/Nginx), or Node.js, particularly REST APIs.

More at: [ericbullington.com](https://ericbullington.com)

### License
MIT

Copyright (c) 2014-2015 Eric. S Bullington, Lim Yang Wei, and project [contributors](https://github.com/esbullington/react-d3/graphs/contributors)
