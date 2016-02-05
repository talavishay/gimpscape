'use strict';

var $ = require('jquery'),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette'),
	_ = require('underscore');

var fabricToolsChannel = Radio.channel('fabricTools');

	
var textToolsView = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'toolbox shape',
	template: require('./template.html'),
	behaviors: [{ behaviorClass: require('../objectBehaviour.js')}],
	onRender : function(){
		this.obj = fabricToolsChannel.request('getActiveObject');
	},
	ui		:{
		strokeWidth : "select.strokeWidth",
		backgroundColor : ".boxBackgroundColor",
	},
	events 	:{
			'mouseup @ui.backgroundColor' : 'setBackgroundColor',
			'change @ui.strokeWidth' : 'setStrokeWidth',
	},
	toggleShaodw : function(){
		this.$el.find(".shadowOptions").toggle();
	},
	_spectrum : function(obj, _func){
		var _elm = this.$el;
		_elm.spectrum({
				showPalette: true,
				allowEmpty: true,
				hideAfterPaletteSelect:true,
				showAlpha: true,
				palette: [
					['black', 'white', 'blanchedalmond'],
					['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
				],
				change: _func,
				hide: function() {
					_elm.spectrum("destroy");
				}
		});
		setTimeout(function(){
			_elm.spectrum("show");
		},0);
	},
	setBackgroundColor: function (ev) {		
		var obj = fabricToolsChannel.request('getActiveObject');
		if(obj.getFill()){
			obj.setFill(null);
			fabricToolsChannel.trigger('renderall');
		} else {
			var _func = function(color) {
				if(color){
					obj.setFill(color.toRgbString());
					fabricToolsChannel.trigger('renderall');		
				}
			};
			this._spectrum(obj, _func);
		}		
	},
	setStrokeWidth : function (ev) {
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setStroke(true);
			obj.setStrokeWidth(ev.target.value);
			
			fabricToolsChannel.trigger('renderall');
	},

});

module.exports =  textToolsView;
