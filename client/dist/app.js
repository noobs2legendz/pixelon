/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _React = React;
	var Component = _React.Component; // import {Component} from 'react';

	var _ref = _;
	var map = _ref.map; // import {map} from 'lodash'

	// var c = document.getElementById("myCanvas");

	var Cell = function (_Component) {
	  _inherits(Cell, _Component);

	  function Cell() {
	    _classCallCheck(this, Cell);

	    return _possibleConstructorReturn(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).apply(this, arguments));
	  }

	  _createClass(Cell, [{
	    key: "render",
	    value: function render() {
	      var cell = this.props.cell;

	      var classes = "Grid_Cell";
	      if (cell && !!cell.player) {
	        classes = classes + ' Grid_Cell_Occupied';
	      }
	      return React.createElement("div", { className: classes });
	    }
	  }]);

	  return Cell;
	}(Component);

	var Row = function (_Component2) {
	  _inherits(Row, _Component2);

	  function Row() {
	    _classCallCheck(this, Row);

	    return _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).apply(this, arguments));
	  }

	  _createClass(Row, [{
	    key: "render",
	    value: function render() {
	      var cells = this.props.cells;

	      var cellComponents = [];
	      _.each(cells, function (cell) {
	        cellComponents.push(React.createElement(Cell, { cell: cell }));
	      });
	      return React.createElement(
	        "div",
	        { className: "Grid_Row" },
	        cellComponents,
	        React.createElement("div", { style: { clear: 'both' } })
	      );
	    }
	  }]);

	  return Row;
	}(Component);

	var Grid = function (_Component3) {
	  _inherits(Grid, _Component3);

	  function Grid(props, context) {
	    _classCallCheck(this, Grid);

	    var _this3 = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props, context));

	    window.WebSocket = window.WebSocket || window.MozWebSocket;
	    var connection = new WebSocket('wss://pixelon.herokuapp.com/');
	    connection.onmessage = function (message) {
	      var moves = JSON.parse(message.data).grid;
	      // const cells = _.values(json);
	      var newGrid = _.clone(_this3.state.grid);
	      for (var key in moves) {
	        var position = key.split('|');
	        if (position[0] > 0 && position[1] > 0) {
	          if (typeof newGrid[position[0]] !== 'undefined' && typeof newGrid[position[0]][position[1]] !== 'undefined') {
	            newGrid[position[0]][position[1]] = {
	              player: 1
	            };
	          }
	        }
	      }
	      _this3.setState({
	        grid: newGrid
	      });
	      // _.each(cells[0], (cell) => {
	      // })
	    };
	    var grid = [];
	    var GRID_HEIGHT = 20;
	    var GRID_WIDTH = 78;
	    for (var i = 0; i < GRID_HEIGHT; i++) {
	      var row = [];
	      for (var a = 0; a < GRID_WIDTH; a++) {
	        row.push(null);
	      }
	      grid.push(row);
	    }
	    _this3.state = {
	      grid: grid,
	      connection: connection
	    };
	    return _this3;
	  }

	  _createClass(Grid, [{
	    key: "componentWillMount",
	    value: function componentWillMount() {
	      var connection = this.state.connection;

	      Mousetrap.bind('left', function () {
	        connection.send('left');
	      });
	      Mousetrap.bind('right', function () {
	        connection.send('right');
	      });
	      Mousetrap.bind('up', function () {
	        connection.send('up');
	      });
	      Mousetrap.bind('down', function () {
	        connection.send('down');
	      });
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _props = this.props;
	      var items = _props.items;
	      var addItem = _props.addItem;
	      var grid = this.state.grid;

	      var rows = [];
	      _.each(grid, function (row, index) {
	        rows.push(React.createElement(Row, { cells: row }));
	      });
	      return React.createElement(
	        "div",
	        null,
	        rows
	      );
	    }
	  }]);

	  return Grid;
	}(Component);

	var Game = function (_Component4) {
	  _inherits(Game, _Component4);

	  function Game() {
	    _classCallCheck(this, Game);

	    return _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).apply(this, arguments));
	  }

	  _createClass(Game, [{
	    key: "render",
	    value: function render() {
	      return React.createElement(
	        "div",
	        { className: "Game" },
	        React.createElement(
	          "div",
	          { className: "logo-container" },
	          React.createElement("img", { className: "logo", src: "pixelon.svg", alt: "pixelon" })
	        ),
	        React.createElement(
	          "div",
	          { className: "container" },
	          React.createElement(
	            "div",
	            { className: "highscores" },
	            React.createElement(
	              "div",
	              { className: "currentHS" },
	              React.createElement(
	                "div",
	                { className: "currentName" },
	                "J0el69"
	              ),
	              React.createElement(
	                "div",
	                { className: "currentScore" },
	                "15,240"
	              )
	            ),
	            React.createElement(
	              "div",
	              { className: "previousHS" },
	              React.createElement(
	                "div",
	                { className: "previousName" },
	                "Previ0us"
	              ),
	              React.createElement(
	                "div",
	                { className: "previousScore" },
	                "284,192"
	              )
	            ),
	            React.createElement(
	              "div",
	              { className: "serverHS" },
	              React.createElement(
	                "div",
	                { className: "serverName" },
	                "Server Highsc0re"
	              ),
	              React.createElement(
	                "div",
	                { className: "serverScore" },
	                "12,284,192"
	              )
	            )
	          ),
	          React.createElement(
	            "div",
	            { className: "game" },
	            React.createElement(Grid, null),
	            React.createElement(
	              "div",
	              { className: "player-blue" },
	              React.createElement("div", { className: "blue-head" }),
	              React.createElement("div", { className: "blue-tail" })
	            ),
	            React.createElement(
	              "div",
	              { className: "player-red" },
	              React.createElement("div", { className: "red-head" }),
	              React.createElement("div", { className: "red-tail" })
	            ),
	            React.createElement(
	              "div",
	              { className: "player-green" },
	              React.createElement("div", { className: "green-head" }),
	              React.createElement("div", { className: "green-tail" })
	            ),
	            React.createElement(
	              "div",
	              { className: "player-orange" },
	              React.createElement("div", { className: "orange-head" }),
	              React.createElement("div", { className: "orange-tail" })
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Game;
	}(Component);

	ReactDOM.render(React.createElement(Game, null), document.getElementById('game'));

/***/ }
/******/ ]);