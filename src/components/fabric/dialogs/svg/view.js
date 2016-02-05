'use strict';

var $ = require('jquery'),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette'),
	_ = require('underscore'),
	_model = require("./model.js");
var fabricToolsChannel = Radio.channel('fabricTools');
//~ dialogs.svgModel = 
	
var svgView = Marionette.ItemView.extend({
	tagName	: 'div',
	className : 'svg',
	model : new _model(),
	template: require('./template.html'),
	events  : {
		"click img" : (ev) => {
			//~ fabricToolsChannel.trigger("");
			console.log(ev.currentTarget.currentSrc);
			App.canvas.add_svg(ev.currentTarget.currentSrc ,1,1);
		}
	},
	//~ behaviors: [{ behaviorClass: require('../objectBehaviour.js')}],
	initialize : function(){
		this.model.fetch();
	},
	modelEvents : {
		"sync" : "_render",
		"change" : "_render",
		"change:svgs": function(){
			// handle the name changed event here
			console.log(this.model);	
		}
	},
	_render : function(){
		
		this.render();
	},
	onRender : function(){
		//~ console.log("svg view onRender");
		//~ console.log(this);
		
		//~ console.log("onRender");
		//~ console.log(this.model);
		
		//~ ;.then(function(){
			//~ console.log("after:");
			//~ console.log(this.model);
		//~ });
	},
	//~ ui		:{
		//~ strokeWidth : "select.strokeWidth",
		//~ backgroundColor : ".boxBackgroundColor",
	//~ },
	//~ events 	:{
			//~ 'mouseup @ui.backgroundColor' : 'setBackgroundColor',
			//~ 'change @ui.strokeWidth' : 'setStrokeWidth',
	//~ },
	//~ 
});

module.exports =  svgView;
