'use strict';

var Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette');

var fabricToolsChannel = Radio.channel('fabricTools');
	
var view = Marionette.ItemView.extend({
	tagName	: 'tr',
	className : 'file',
	template: require('./template.html'),
	ui 		: {
		image : "img",
		remove : ".remove"
	},
	events		: {
		"click @ui.image" : "image",
		"click @ui.remove" : "_remove",
	},
	image 		: function(ev){	
			fabricToolsChannel.trigger("add:image", this.model.get("src"));
			
	},
	_remove : function(){
		this.model.destroy();
			
	}
	
});

module.exports =  view;
