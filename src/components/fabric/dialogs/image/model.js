'use strict';
var Backbone = require('backbone'),
	BackbonePouch = require("backbone-pouch");
	
	App.BackbonePouch = BackbonePouch;

var model = Backbone.Model.extend({
	sync: BackbonePouch.sync({
		db: window.PouchDB('imagedialogModel')
	}),
	//~ clear: function() {
	  //~ this.destroy();
	//~ }

});

module.exports = model;
