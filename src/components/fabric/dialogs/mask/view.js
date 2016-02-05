'use strict';

var Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette');

var fabricToolsChannel = Radio.channel('fabricTools');
	
var view = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'dialog mask',
	template: require('./template.html'),
	ui 		: {
		restore :".restore",
	},
	events		: {
		"click @ui.restore" : "restore",
	},
	restore : function(){
		var obj = fabricToolsChannel.request('getActiveObject');
			obj.clipTo = null
			
			fabricToolsChannel.trigger('renderall');
	}
	
});

module.exports =  view;
