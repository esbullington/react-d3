## react-d3
Modular ReactJS charts calculated with the help of d3.

**Caution:**  alpha state software.

[![Build Status](https://travis-ci.org/esbullington/react-d3.svg?branch=master)](https://travis-ci.org/esbullington/react-d3)

### Chart types
Current charts:
* bar chart
* line chart
* pie chart
* area chart (*very* basic -- no axis!)

The basic charts generated from the examples/main.js ReactJS app can be [viewed here](http://esbullington.github.io/react-d3).  I'm hard at work expanding these basic examples.

### Background
Although there have been [several](http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/) [different](http://bl.ocks.org/milroc/d22bbf92231876505e5d) approaches proposed for combining the power of d3 with the flexibility and modularity of ReactJS, the approach I'm using here was inspired by [this blog post](http://10consulting.com/2014/02/19/d3-plus-reactjs-for-charting/) by Ben Smith of [Binary Consulting](http://10consulting.com/).

With this approach, ReactJS itself is responsible for the SVG markup.  d3 is used for its tremendous collection of utility functions, such as those that calculate the `path` value for various chart types.

### Todo
* Many more charts types!
* Add optional animation to charts using ReactJS transitions
* Demos galore
* Documentation

### License
MIT

Copyright (c) 2014 Eric. S Bullington
