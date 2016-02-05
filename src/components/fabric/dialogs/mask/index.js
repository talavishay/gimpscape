'use strict';
var view = require('../svg/view');


	
var maskView = view.extend({
	template: require('./template.html'),
	events  : {
		"click img" : (ev) => {
					App.fabricToolsChannel.trigger("object:clip", ev.currentTarget.currentSrc, .8,.8);
		},
		"click .restore" : 'restore'
		
	},
	restore : function(){
		var obj = App.fabricToolsChannel.request('getActiveObject');
			obj.set({ clipTo: null});
			App.fabricToolsChannel.trigger('renderall');
			
	},
	onRender : function(){
		console.log("mask view onRender");
		//~ console.log(this);
		
		//~ console.log("onRender");
		//~ console.log(this.model);
		
		//~ ;.then(function(){
			//~ console.log("after:");
			//~ console.log(this.model);
		//~ });
	},
});
module.exports = maskView;
