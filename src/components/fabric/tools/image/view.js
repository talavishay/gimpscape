'use strict';
var Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette');
var fabricToolsChannel = Radio.channel('fabricTools');

var View = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'toolbox image',
	template: require('./template.html'),
    behaviors: [
		{ behaviorClass: require('../objectBehaviour.js')},
		{ behaviorClass: require('../../dialogs/dialogsBehavior.js')}
    ],
    ui		: {
		zoom : ".zoom",
		opacity : ".opacity",
	},
    events		: {
			"input @ui.zoom" : "zoomBy",
			"change @ui.zoom" : "zoomByUpdate",
			
	},
	zoomBy : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.cw = obj.width / ev.currentTarget.value;
		obj.ch = obj.height / ev.currentTarget.value;
		
		obj.cx = obj.width / 2 - (obj.cw / 2);
		obj.cy = obj.height / 2 - (obj.ch / 2);
		
		
		obj.rerender();
		
	},
	zoomByUpdate : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		this.model.set("zoomFactor",  obj.width /  obj.cw );
		this.model.set("zoomPercent",  ((Math.round((obj.cw / obj.width) * 100 )-100) * (-1)) * 2);
		this.render();
	},
	setOpacity : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setOpacity(ev.currentTarget.value);
			fabricToolsChannel.trigger('renderall');
	},	
});

module.exports =  View;
