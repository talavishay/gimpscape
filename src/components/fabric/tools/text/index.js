'use strict';

var $ = require('jquery'),
	Marionette = require('backbone.marionette'),
	_ = require('underscore'),
	Radio = require('backbone.radio');
var textToolsStateModel = require('./textToolsStateModel.js');


//~ var textToolView = $(require('./template.html')());
var textToolView = require('./view');
var _model = new textToolsStateModel;
//~ 
var flv = textToolView.extend({
	//~ 
	model : _model
});
module.exports = flv;

