'use strict';

var $ = require('jquery'),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette'),
	_ = require('underscore');

var fabricToolsChannel = Radio.channel('fabricTools');

var View = Marionette.ItemView.extend({
	tagName	: 'span',
	className : 'toolbox shape',
	template: require('./template.html'),
	behaviors: [{ behaviorClass: require('../objectBehaviour.js')}],
	ui		:{
		//~ deleteObject	:	".trash",			
		alignTop 		:	".alignTop" ,
		alignMiddleVert : 	".alignMiddleVert",
		alignBottomVert : 	".alignBottomVert",
		alignLeftHorz 	:	".alignLeftHorz",
		alignMiddleHorz	:	".alignMiddleHorz",
		alignRightHorz	:	".alignRightHorz",
		groupObjects	:	".groupObjects",
		unGroup			:	".unGroup"
	},
	events 	:{
		//~ 'click @ui.deleteObject' : 'deleteObject',
		'click @ui.alignTop' 		:	"alignTop" ,
		'click @ui.alignMiddleVert' : 	"alignMiddleVert",
		'click @ui.alignBottomVert' : 	"alignBottomVert",
		'click @ui.alignLeftHorz'	:	"alignLeftHorz",
		'click @ui.alignMiddleHorz'	:	"alignMiddleHorz",
		'click @ui.alignRightHorz'	:	"alignRightHorz",
		'click @ui.groupObjects'	:	"groupObjects",
		'click @ui.unGroup'			:	"unGroup"
	},
	//~ deleteObject :function(){
		//~ if(App.canvas.getActiveGroup()){
		  //~ App.canvas.getActiveGroup().forEachObject(function(o){ App.canvas.remove(o) });
		  //~ App.canvas.discardActiveGroup().renderAll();
		//~ } else {
		  //~ App.canvas.remove(App.canvas.getActiveObject());
		//~ }
	//~ },
	alignTop : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginY : "top",
				top : group.getBoundingRectHeight()/2 * (-1)
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	
	alignBottomVert : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginY : "bottom",
				top : group.getBoundingRectHeight()/2 - item.getBoundingRectHeight()
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	alignLeftHorz : function(){
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginX : "left",
				left : group.getBoundingRectWidth()/2 * (-1)
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	alignMiddleHorz : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginX : "center",
				left : item.getBoundingRectWidth()/2 * (-1)
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	alignMiddleVert : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginY : "center",
				top : item.getBoundingRectHeight()/2 * (-1)
				
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	alignRightHorz : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		_.each(group.objects || group._objects, function(item){
			item.set({
				OriginX : "right",
				left : group.getBoundingRectWidth()/2 - item.width
			});
		});
		fabricToolsChannel.trigger('renderall');
		this.reGroup();
	},
	groupObjects : function(){ 
		var group = fabricToolsChannel.request('getActiveGroup');
		var g = new fabric.Group();
		
		var g = _.extend(g, _.pick(group, '_objects', "top", "left", "width", "height"));		
		this.deleteObject();
		App.canvas.add(g).setActiveObject(g);
		fabricToolsChannel.trigger('rebuildCanvas');
		
	},
	unGroup : function() {
		var group = fabricToolsChannel.request('getActiveGroup');
		var destroyedGroup = group.destroy();
		var items = destroyedGroup.getObjects();

		items.forEach(function (item) {
			App.canvas.add(item);
		});
		App.canvas.remove(group);
	},
	reGroup : function() {
		var group = fabricToolsChannel.request('getActiveGroup');
		if(group.objects){
			var g = new fabric.Group();
			_.each(group.objects || group._objects, function(item){
				item.active = false;
				g.addWithUpdate(item);
			});
			var g = _.extend(g, _.pick(group,  'top', 'left'));
			App.canvas.remove(group);
			 App.canvas.discardActiveGroup();
			App.canvas.add(g).setActiveObject(g);
			this.groupObjects();
		}
	}
});

module.exports =  View;
