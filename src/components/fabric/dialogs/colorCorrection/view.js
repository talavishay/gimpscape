'use strict';

var $ = require('jquery'),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette');

var fabricToolsChannel = Radio.channel('fabricTools');

	
var textToolsView = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'dialog colorCorection',
	template: require('./template.html'),
	ui 		: {
		restore :".restore",
		brightness : ".brightness",
		sharpness : ".sharpness",
		tintColor : "#tintColor",
		setTintColor : ".setTintColor"	
	},
	events		: {
		"click @ui.restore" : "restore",
		"click @ui.tintColor" : "setTintColor",
		"change @ui.setTintColor" : "_setTintColor",
		"input @ui.opacity" : "setOpacity",
		"change @ui.brightness" : "setBrightness",
		"change @ui.sharpness" : "setSharpness",
	},
	
	_spectrum : function(obj, _func){
		
		var _elm = this.$el;
		_elm.spectrum({
				showPalette: true,
				allowEmpty: true,
				hideAfterPaletteSelect:true,
				showAlpha: false,
				palette: [
					['black', 'white', 'blanchedalmond'],
					['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
				],
				change: _func,
				hide: function() {
					_elm.spectrum("destroy");
				}
		});
		setTimeout(function(){_elm.spectrum("show")},0);
	},
	setBrightness : function(ev){
			var self = this;
		this.$el.addClass("filtering");
		//TODO: fix delay in addClass in order to indicate the state of filter job....
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.filters[1] = new fabric.Image.filters.Brightness({
		  brightness: parseInt(ev.currentTarget.value)
		});
		obj.applyFilters(function(x){
			fabricToolsChannel.trigger('renderall');
			self.$el.removeClass("filtering");
		});
	},
	setSharpness : function(ev){
			var self = this;
		this.$el.addClass("filtering");
		//TODO: fix delay in addClass in order to indicate the state of filter job....
		var obj = fabricToolsChannel.request('getActiveObject'),
			self = this;
		
		var filter = new fabric.Image.filters.Convolute({
		  matrix: [ 0, -1,  0,
				   -1,  4+parseInt(ev.currentTarget.value), -1,
					0, -1,  0 ]
		});
		obj.filters[0] = filter;
			
		obj.applyFilters(function(x){
			fabricToolsChannel.trigger('renderall');
			self.$el.removeClass("filtering");
		});
	},
	setTintColor : function(ev){
		var self = this,
			_func = function(color){
				if(color){
					self.$el.find("#tintColor")
						.attr("data-tintColor", color.toRgbString())
						.css("background-color",color.toRgbString());
				}
		};
		this._spectrum(null, _func);
	},
	_setTintColor : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		var c = this.$el
			.find("#tintColor")
			.attr("data-tintColor");
			
		var c = tinycolor(c);
		c.setAlpha(ev.currentTarget.value);
		var filter = new fabric.Image.filters.Multiply({
		  color : c.toRgbString()
		});
		obj.filters[0] = filter;
			console.log("start");
		obj.applyFilters(function(x){
			console.log("done");
			fabricToolsChannel.trigger('renderall');
		});
	},
	restore : function(){
		var obj = fabricToolsChannel.request('getActiveObject');
			obj.filters = [];
			obj.applyFilters(function(x){
				console.log("done");
				fabricToolsChannel.trigger('renderall');
			});
	}
	
});

module.exports =  textToolsView;
