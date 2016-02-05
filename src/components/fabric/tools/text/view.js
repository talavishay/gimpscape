'use strict';

var $ = require('jquery'),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette');


var fabricToolsChannel = Radio.channel('fabricTools');

var textToolsView = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'toolbox text',
	template: require('./template.html') ,
	behaviors: [{ behaviorClass: require('../objectBehaviour.js')}],
	ui		:{
		bold			: ".B",
		italic			: ".I",
		textAlignLeft 	: ".textAlignLeft",
		textAlignRight 	: ".textAlignRight",
		textAlignCenter : ".textAlignCenter",
		fontColor 		: ".textColor",
		fontSize 		: ".fontSize",
		textOpacity 	: ".textOpacity",
		strokeWidth 	: ".strokeWidth",
		textStroke 		: ".textStroke",
		textBackgroundColor : ".textBackgroundColor",
		fontFamily		: ".fontFamily",
		lineHeight		: ".lineHeight",
		underline		: ".U",
	},
	events 	:{
		'click @ui.underline' : 'underline',
		'click @ui.bold' : 'bold',
		'click @ui.italic' : 'italic',
		'click @ui.textAlignLeft' : "setTextAlignLeft",
		'click @ui.textAlignRight' : "setTextAlignRight",
		'click @ui.textAlignCenter' : "setTextAlignCenter",
		'input @ui.textOpacity' : 'setTextOpacity',
		'change @ui.fontSize' : 'setfontSize',
		'change @ui.fontFamily' : 'setFontFamily',
		'change @ui.lineHeight' : 'setLineHeight',
		'click @ui.textStroke' : 'setTextStroke',
		'change @ui.strokeWidth' : 'setTextStrokeWidth',
		'mouseup @ui.textBackgroundColor' : 'setTextBackgroundColor',
		'mouseup @ui.fontColor' : 'setFontColor',
	},
	modelEvents: {
        'change': 'refreshView'
    },
    refreshView: function() {
        this.render();
    },
	_style : function(key, val){
			var obj = fabricToolsChannel.request('getActiveObject');
			var isStyled = (this.getStyle(obj, key) || '').indexOf(val) > -1;
			this.setStyle(obj, key, isStyled ? '' : val);
			fabricToolsChannel.trigger('renderall');
	},
	underline : function(a){
			this._style('textDecoration', "underline");			
	},
	bold : function(a){
			this._style('fontWeight', "bold");
	},
	italic : function(a){
			this._style('fontStyle', "italic");
	},
	setTextAlignRight : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.setTextAlign("right");
		fabricToolsChannel.trigger('renderall');
	},
	setTextAlignCenter : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.setTextAlign("center");
		fabricToolsChannel.trigger('renderall');
	},
	setTextAlignLeft : function(ev){
		var obj = fabricToolsChannel.request('getActiveObject');
		obj.setTextAlign("left");
		fabricToolsChannel.trigger('renderall');
	},
	setTextOpacity : function(a){
			var obj = fabricToolsChannel.request('getActiveObject');
				obj.setFill(tinycolor(obj.getFill()).setAlpha(a.target.value).toRgbString());
				fabricToolsChannel.trigger('renderall');
	},
	setfontSize : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setFontSize(ev.currentTarget.value);
			fabricToolsChannel.trigger('renderall');
	},
	setFontFamily : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setFontFamily(ev.currentTarget.value);
			fabricToolsChannel.trigger('renderall');
	},
	setLineHeight : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setLineHeight(ev.currentTarget.value);
			fabricToolsChannel.trigger('renderall');
	},
	setTextStrokeWidth : function (ev) {
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.setStroke(true);
			obj.setStrokeWidth(ev.target.value);
			
			fabricToolsChannel.trigger('rebuildCanvas');
	},
	setTextStroke: function (style) {
			var obj = fabricToolsChannel.request('getActiveObject');
			if(obj.getStroke()){
				obj.setStroke(false);
			} else {
					obj.setStroke(true);
			}
			fabricToolsChannel.trigger('renderall');
	},
	setTextBackgroundColor: function (ev) {
		var obj = fabricToolsChannel.request('getActiveObject');
		if(obj.getTextBackgroundColor()){
			obj.setTextBackgroundColor(null);
			fabricToolsChannel.trigger('renderall');
		} else {
			var _func = function(color) {
				if(color){
					obj.setTextBackgroundColor(color.toRgbString());		
					fabricToolsChannel.trigger('renderall');
				}
			};
			this._spectrum(obj, _func);
		}
	},
	setFontColor : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			var _func = function(color) {
				if(color){
					obj.setFill(color.toRgbString());		
					fabricToolsChannel.trigger('renderall');
				}
			};
			this._spectrum(obj, _func);
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
		setTimeout(function(){_elm.spectrum("show")},0);
	},
	setStyle: function (object, styleName, value) {
		//~ if (object.setSelectionStyles && object.isEditing) {
			//~ var style = { };
			//~ style[styleName] = value;
			//~ object.setSelectionStyles(style);
		//~ }
		//~ else {
			object[styleName] = value;
		//~ }
	},
	getStyle : function (object, styleName) {
		  return (object.getSelectionStyles && object.isEditing)
			? object.getSelectionStyles()[styleName]
			: object[styleName];
	},
});

module.exports =  textToolsView;
