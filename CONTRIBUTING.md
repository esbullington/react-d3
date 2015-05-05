## Code Contributions
_By contributing code to React-d3, you are agreeing to release it under the MIT License._

## Environment
Please read the [development documentation](https://github.com/esbullington/react-d3/wiki/Development), which includes information on how to set up a development environment.

## Coding Rules
* All charts should be rendered using SVG, and not using HTML, Canvas, or WebGL.  We want to present a standard API for user interactions, transformations, and styling. If we use multiple different renderers for different charts, that task becomes much more difficult.
* All new charts should use SVG generated using React, and must *not* use d3's SVG generation utilities.  The reason for this has to do with React lifecycles and the virtual DOM, and also with avoiding React `state`.  Chart axes are still rendered using d3, but this is soon to go.  As long as all of your SVG is produced by React's `render` method, you're good to go.
* Each chart should be given its own file, or if complex enough, its own directory.  If you create a chart directory, please include an `index.js` file in its root, in which the root chart component is exported.  This way, we can `require` the chart using Browserify, just like with a single file chart.
* All new charts and bug fixes should be tested by one or more specs (we use Karma with Chai for assertions, please see [here](https://github.com/esbullington/react-d3/blob/master/tests/piechart-tests.js) for an example test).  Tests are not required for minor new features, but would be appreciated.
* Please try to include an example if you submit a new chart.
* Please set the default use style on charts that use a multicolor palette to use d3's `d3.scale.category20c()` [color palette](https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20c).  For single color charts, please set the default fill color to `#3182bd`.
* We try follow the rules contained in [Google's JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).  No tabs, 2-space indents, etc.

## React-specific guidelines
* Please try to avoid React `state` to the extent possible. Ideally, data should be passed in to the top-level chart via `props` and then passed down to child components as needed.  This isn't because React `state` is inherently bad, but it breaks referential integrity, makes it hard to reason about errors, and prevents certain optimizations that are otherwise possible.
* In your components, please document/assert your prop types using React's `propTypes` and set default props if necessary.
* Try to list React methods with custom methods at the top of components, and React methods at the bottom, in lifecycle order (this is not always the case in existing code). Non-lifecycle functions should be preceded by an underscore, as is the emerging style for React.
* Some React suggestions can be found [here](https://reactjsnews.com/react-style-guide-patterns-i-like/) and [here](http://blog.whn.se/post/69621609605/writing-good-react-components).  The second link in particular is helpful.

## SVG Performance Notes
* Whenever possible, do transforms on groups of items (using `<g>`) as opposed to individual items.

## Project Suggestions
* This is open source, and we're all doing this on our own free will, by choice.  So please be nice to each other, and treat both users and fellow devs with respect when filing issues and submitting or commenting on pull requests.
