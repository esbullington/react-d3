'use strict';

var React = require('react');
var d3 = require('d3');
var shade = require('../utils').shade;
var VoronoiCircle = require('./VoronoiCircle');
var VoronoiRect = require('./VoronoiRect');

module.exports = React.createClass({

  displayName: 'VornoiContainer',

  getDefaultProps() {
    return {
      symbol: 'circle',
      symbolRadius: 3,
      symbolWidth: 6,
      symbolHeight: 6,
      symbolFill: '#1f77b4',
      hoverAnimation: true
    };
  },

  getInitialState() {
    if (this.props.symbol == 'circle') {
      return {
        symbolRadius: this.props.symbolRadius,
        symbolFill: this.props.symbolFill,
      }
    }
    else {
      return {
        symbolWidth: this.props.symbolWidth,
        symbolHeight: this.props.symbolHeight,
        symbolFill: this.props.symbolFill,
      }
    }
  },

  render() {
    // animation controller
    var handleMouseOver, handleMouseLeave;
    if(this.props.hoverAnimation) {
      handleMouseOver = this._animateSymbol;
      handleMouseLeave = this._restoreSymbol;
    } else {
      handleMouseOver = handleMouseLeave = null;
    }

    switch (this.props.symbol) {
      case 'circle':
        return (
            <g>
              <VoronoiCircle
                  handleMouseOver={handleMouseOver}
                  handleMouseLeave={handleMouseLeave}
                  voronoiPath={this._drawPath(this.props.vnode)}
                  cx={this.props.cx}
                  cy={this.props.cy}
                  symbolRadius={this.state.symbolRadius}
                  symbolFill={this.state.symbolFill}
                  />
            </g>
        );
        break;
    case 'rect':
      return (
          <g>
            <VoronoiRect
                handleMouseOver={handleMouseOver}
                handleMouseLeave={handleMouseLeave}
                voronoiPath={this._drawPath(this.props.vnode)}
                cx={this.props.cx }
                cy={this.props.cy}
                symbolWidth={this.state.symbolWidth}
                symbolHeight={this.state.symbolHeight}
                symbolFill={this.state.symbolFill}
                />
          </g>
      );
      break;
    default:
      console.log('Symbol to display data point is not available.');
    }
  },

  _animateSymbol() {
    if (this.props.symbol == 'circle') {
      this.setState({
        symbolRadius: this.props.symbolRadius * ( 5 / 4 ),
        symbolFill: shade(this.props.symbolFill, 0.2)
      });
    }
    else {
      this.setState({
        symbolWidth: this.props.symbolWidth * ( 5 / 4 ),
        symbolHeight: this.props.symbolHeight * ( 5 / 4 ),
        symbolFill: shade(this.props.symbolFill, 0.2)
      });
    }
  },

  _restoreSymbol() {
    this.setState(
      this.getInitialState()
    );
  },

  _drawPath: function(d) {
    if(d === undefined) {
      return; 
    }  
    return 'M' + d.join(',') + 'Z';
  },
});
