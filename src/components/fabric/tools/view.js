var Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette');
	//~ _ = require('underscore'),
var fabricToolsChannel = Radio.channel('fabricTools');

var textTools = require("./text");
var textToolsStateModel = require('./text/textToolsStateModel.js');

var shapeTools = require("./shape");
var shapeToolsStateModel = require('./shape/shapeToolsStateModel.js');

var groupTools = require("./group");
var groupToolsStateModel = require('./group/groupToolsStateModel.js');

var imageTools = require("./image");
var imageToolsStateModel = require('./image/imageToolsStateModel.js');

//~ var imageToolsStateModel = require('./image/imageToolsStateModel.js');


var toolsLayoutView = Marionette.LayoutView.extend({
	tagName : 'span',
	className : 'fabricTools',
	//~ template : _.template('<span id="main"><</span>'),
	template: require('./template.html') ,
	regions : {
		main : "#main",
		dialog : "#dialog"
		
	},
	initialize : function(){
		
		this.listenTo(fabricToolsChannel, "show", function(){
			
			
			
			var obj = fabricToolsChannel.request('getActiveObject');
			if(!obj){
				var obj = fabricToolsChannel.request('getActiveGroup');
			}
			
			if(obj){
			//~ if(obj && (this.model.get("currentToolsType") != obj.type)){
				//~ this.model.set("visible", false) ;
			//~ }
			//~ if(obj && (!this.model.get("visible") )){
				
				
				switch(obj.type){
					case "i-text":
						var view = textTools;
						var _model = new textToolsStateModel(obj);
					break;
					case "image":
					case "cropzoomimage":
						var view = imageTools;
						var _model = new imageToolsStateModel(obj);
						
					break;
					case "path-group":
					case "rect":
					case "triangle":
					case "circle":
						var view = shapeTools;
						var _model = new shapeToolsStateModel(obj);
					break;
					
					
					case "group":
						var view = groupTools;
						var _model = new shapeToolsStateModel(obj);
					break;
				}
				
				
				this.main.show(new view({
					model : _model
				}));
				
				var absCoords = obj.canvas.getAbsoluteCoords(obj);
				this.$el.css({
						left : absCoords.right - this.$el.width(),
						top : absCoords.bottom,
						visibility: 'visible',
						position : 'absolute'
				}).slideDown("fast");	
				//~ this.model.set("visible", true);
				//~ this.model.set("currentToolsType", obj.type);
			}
				
		});
		this.listenTo(fabricToolsChannel, "hide", function(){
			if(this.main.currentView){
				this.main.currentView.destroy();
			}
			if(this.dialog.currentView){
				this.dialog.currentView.destroy();
			}
		});
		
		
		this.listenTo(fabricToolsChannel, "dialog:close", function(){
			
					this.dialog.$el.find(".dialogs").hide();
			
		});
		
		
	},
	initObj : function(obj){
				console.log(obj);
	},
	deactivateTools : function(){
				var self = this;
				var tool = self.model.get("toolbox");
				if(tool){
					tool.elm.slideUp("fast", function(){
						self.model.set("toolboxActive", false);
					});	
				}
	},
	fun : function(options, self) {
			if(this.model.get("toolboxActive")){
				this.deactivateTools();
			}
	},
	activateTools : function(canvas, obj, options){
			
			this.deactivateTools();
			var self = this;
			if(obj.type == "rect"){
				var tool = this.shapeToolBox;
			}; 
			if(obj.type == "text" | obj.type == "i-text"){
				var tool = this.textToolBox;
			}
			if(obj.type == "group" ){
				var tool = this.groupToolBox;
			}
	}
});
module.exports = toolsLayoutView;
