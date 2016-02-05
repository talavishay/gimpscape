'use strict';

var Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette');

var fabricToolsChannel = Radio.channel('fabricTools');
	
var view = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'shadow dialog shadowOptions',
	template: require('./template.html'),
	ui 		: {
		restore :".restore",
		shadowTransperncy	:	".transperncy",
		shadowAngle		:	".angle",
		shadowDistance	:	".distance",
		shadowScatter	:	".scatter"
},
	events		: {
		'input @ui.shadowTransperncy' : 'setShadowTransperncy',
		'input @ui.shadowAngle' : 'setShadowAngle',
		'input @ui.shadowDistance' : 'setShadowDistance',
		'input @ui.shadowScatter' : 'setShadowScatter',
		"click @ui.restore" : "restore",
	},
	onBeforeRender : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		if(!obj.getShadow()){			
			obj.setShadow({
				color:	'rgba(0,0,0,.8)',
				offsetX : obj.width*0.05,
				offsetY : obj.height*0.05,
				blur	: obj.width*0.1
			});
		};
		fabricToolsChannel.trigger('renderall');
	},
	restore : function(){
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.clipTo = null
		
		fabricToolsChannel.trigger('renderall');
	},
	setShadowTransperncy : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			var _shadow = obj.getShadow();
			_shadow.color = tinycolor(_shadow.color)
				.setAlpha(ev.target.value)
				.toRgbString();
			obj.setShadow(_shadow);
			fabricToolsChannel.trigger('renderall');
	},
	setShadowAngle : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			var _shadow = obj.getShadow();
			var angle = (180 - ev.target.value) * Math.PI / 180; // convert to radians
			var distance = this.$el.find(".distance").val();
	 
			_shadow.offsetX = Math.round(Math.cos(angle) * distance);
			_shadow.offsetY = Math.round(Math.sin(angle) * distance);
			obj.setShadow(_shadow);
			fabricToolsChannel.trigger('renderall');
	},
	setShadowDistance : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			var _shadow = obj.getShadow();
			var _angle = this.$el.find(".angle").val();
			var angle = (180 - _angle) * Math.PI / 180; // convert to radians
			var x =  Math.round(Math.cos(angle) * ev.target.value),
				y =  Math.round(Math.sin(angle) * ev.target.value);
	 
			_shadow.offsetX = x;
			_shadow.offsetY = y;
			obj.setShadow(_shadow);
	  
			fabricToolsChannel.trigger('renderall');
	},
	setShadowScatter : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			var _shadow = obj.getShadow();
			_shadow.blur = 	ev.target.value;
			obj.setShadow(_shadow);
			fabricToolsChannel.trigger('renderall');
	},	
});

module.exports =  view;
