## react-d3
Modular ReactJS charts made using d3 chart utilities. Examples of available charts can be [viewed here](http://esbullington.github.io/react-d3).

**Caution:**  alpha state software. Chart APIs will change.

[![Build Status](https://travis-ci.org/esbullington/react-d3.svg?branch=master)](https://travis-ci.org/esbullington/react-d3)

Please consider supporting this project by hiring me for your next contract job.  I do:
* custom d3 visualizations.
* React, AngularJS, or Backbone frontend work.
* backend work in Python(Flask, Django), Lua(w/Nginx), or Node.js, particularly REST APIs.

More at: [ericbullington.com](https://ericbullington.com)

### Version
[![npm version](https://badge.fury.io/js/react-d3.png)](https://www.npmjs.com/package/react-d3)

 Additional chart types and chart animations are soon to come.

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

### JSFiddle
There's a development build available for experimentation on JSFiddle: [http://jsfiddle.net/esbullington/jp9dkh1g/](http://jsfiddle.net/esbullington/jp9dkh1g/)

Please note that this build should probably not be used in production, since it bundles all of react-d3's dependencies in a single bundle (this is also the cause of the "Cannot read property 'firstChild' of undefined" error message on the JS console, which occurs when there are two React libraries in the same namespace).

All the react-d3 charts are available in this JSFiddle fork under the global `rd3` namespace.

### Background
Although there have been [several](http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/) [different](http://bl.ocks.org/milroc/d22bbf92231876505e5d) approaches proposed for combining the power of d3 with the flexibility and modularity of ReactJS, the approach I'm using here was inspired by [this blog post](http://10consulting.com/2014/02/19/d3-plus-reactjs-for-charting/) by Ben Smith of [Binary Consulting](http://10consulting.com/).  Basically, it uses React to generate a chart's svg components using stateless React components.

With this approach, ReactJS itself is responsible for the SVG markup.  d3 is used for its tremendous collection of utility functions, such as those that calculate the `path` value for various chart types.

However, I've diverged a bit from this original vision and am storing a bit of state in top-level chart components in order to leverage d3's axis generators, at least until I develop native React chart axes.

### Todo
* Many more charts types to do:
  - candlestick
  - radial gauge
  - and many more...
* Add optional animation to charts using ReactJS transitions
* Demos galore
* Documentation

### Changelog

####0.1.0:
- Added treemap (Thanks @yang-wei!)
- Restructured project for improved npm compatibility
- Harmonized chart palettes
- Fixed non-initial-render for charts with axes (contributions from @tarrencev and @unbracketed)
- Improved documentation (contribution from @jeffriesen)
- Improved chart APIs (contribution from @wookiehangover)

####0.0.1:
- Initial release with linechart, barchart and areachart follow in subsequent patch updates

### License
MIT

Copyright (c) 2014 Eric. S Bullington, Lim Yang Wei, and project [contributors](https://github.com/esbullington/react-d3/graphs/contributors)
