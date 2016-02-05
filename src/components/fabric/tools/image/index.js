'use strict';
var Model = require('./imageToolsStateModel.js');

var view = require('./view');
var _model = new Model;
var v = view.extend({
	model : _model
});

module.exports = v;
