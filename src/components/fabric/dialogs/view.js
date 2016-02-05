'use strict';

var dialogs = {},
	$ = require('jquery'),
	Backbone = require("backbone"),
	//~ LocalStorage = require("backbone.localstorage"),
	Radio = require('backbone.radio'),
	spectrum = require('spectrum-colorpicker')($),
	Marionette = require('backbone.marionette');
	
var fabricToolsChannel = Radio.channel('fabricTools');

dialogs.imageColorCorrectionTools = require("./colorCorrection");
dialogs.imageColorCorrectionToolsModel = require('./colorCorrection/imageColorModel.js');

dialogs.imageMask = require("./mask");
//~ dialogs.imageMaskModel = require('./mask/maskModel.js');
dialogs.imageMaskModel = require("./svg/model.js");
	
	

dialogs.image = require("./image");


	
dialogs.dropShadow = require("./dropShadow");
dialogs.dropShadowModel = require("./dropShadow/model.js");

dialogs.svg = require("./svg");


var dialogsView = Marionette.LayoutView.extend({
	tagName	: 'span',
	className : 'dialogs',
	template: require('./template.html'),
	regions	:	{
			"nav" : "#nav",
			"toolContent" : "#toolContent",
	},
	behaviors: [{ behaviorClass: require('./dialogsBehavior.js')}],
	childEvents: {
		//~ render: 'position'
		show: 'position'
	},
	onShow 	:	function(){
		this.$el.hide();
		//~ console.log("dialogs VIEW -- onShow ");
		
	},
	position : function() {
			// This callback will be called whenever a child is rendered or emits a `render` event
			//~ this.$el.show();
			this.$el.find("#nav button").css("background" , "");
			
			//~ 
			//~ var obj = fabricToolsChannel.request('getActiveObject');
			//~ 
			//~ if(obj){
				//~ var absCoords = App.canvas.getAbsoluteCoords(obj);
				//~ this.$el.css({
						//~ left : absCoords.right - this.$el.width(),
						//~ top : absCoords.bottom,
						//~ visibility: 'visible',
						//~ position : 'absolute'
				//~ }).slideDown("fast");	
			//~ } else {
				this.$el.css({
						left : window.innerWidth/4 ,
						top : 22,
						visibility: 'visible',
						position : 'absolute',
						width		: window.innerWidth/2
				}).slideDown(500);	
				
			
			//~ };
	},
	initialize : function(){
		
		this.listenTo(fabricToolsChannel, "dialog:show", function(){
			this.$el.show();
			window.title = "dialog:show";
		});
		this.listenTo(fabricToolsChannel, "dialog:close", function(){
			this.$el.hide();
			window.title = 'dialog:close';
		});
		this.listenTo(fabricToolsChannel, "dialog:position", function(){
			this.position();
			window.title = "position dialog";
		});
		this.listenTo(fabricToolsChannel, "dialog:colorCorrection", function(){
			this.$el.find("#title").text('color corection');
					
			this.$el.find(".colorCorrectionBtn").addClass("active");
			
			var obj = fabricToolsChannel.request('getActiveObject');
			this.toolContent.show(new dialogs.imageColorCorrectionTools({
				model : new dialogs.imageColorCorrectionToolsModel(obj)
			}));
		});
		this.listenTo(fabricToolsChannel, "dialog:imageMask", function(){
			//~ this.$el.show();
			//~ this.$el.find("#nav button").css("background" , "");
			//~ 
			this.$el.find("#title").text('mask');
			this.$el.find(".imageMaskBtn")
							.addClass("active");
			//~ 
			var obj = fabricToolsChannel.request('getActiveObject');
			
			
			var that = this;
			//~ var obj = fabricToolsChannel.request('getActiveObject');
			var _model = new dialogs.imageMaskModel();
			
			_model.fetch().done(function(){
				console.log("imageMaskModel fetch.done");
				
				
				var i = setInterval(function(){;
					that.toolContent.show(new dialogs.imageMask({
						model : _model,
					}));//console.log("tick");
				},100);
				var t = window.setTimeout(function(){
					window.clearInterval(i);window.clearTimeout(t);
				},1000);
			});
			this.toolContent.show(new dialogs.imageMask({
				model : new dialogs.imageMaskModel(obj)
			}));
		});
		
		this.listenTo(fabricToolsChannel, "dialog:image", function(){
			//~ this.$el.show();
			//~ this.$el.find("#nav button").css("background" , "");
			//~ 
			this.$el.find("#title").text('image');
			this.$el.find(".imageMaskBtn")
							.addClass("active");
			//~ 
			var obj = fabricToolsChannel.request('getActiveObject');
			
			
			this.toolContent.show(new dialogs.image());
			
					//~ Todos.fetch();
			//~ dialogs.imageCollection.create({title: "XXXXXX"});
			//~ 
			//~ this.toolContent.show(new dialogs.image({
				//~ model : dialogs.imageModel
			//~ }));
		});
		this.listenTo(fabricToolsChannel, "dialog:dropShadow", function(){
			//~ this.$el.show();
			//~ this.$el.find("#nav button").css("background" , "");
			//~ 
			this.$el.find("#title").text('shadow');
			
			this.$el.find(".dropShadowBtn")
				.addClass("active");
			
			var obj = fabricToolsChannel.request('getActiveObject');
			this.toolContent.show(new dialogs.dropShadow({
				 model : new dialogs.dropShadowModel(obj)
			}));
		});
		this.listenTo(fabricToolsChannel, "dialog:svg", function(){
			//~ this.$el.show();
			//~ this.$el.find("#nav button").css("background" , "");
			//~ 
			this.$el.find("#title").text('SVG');
			
			this.$el.find(".svgBtn")
				.addClass("active");
			var that = this;
			//~ var obj = fabricToolsChannel.request('getActiveObject');
			//~ var _model = new dialogs.svgModel();
			//~ _model.on("change", function(model, value) {
				//~ console.log(value);
			//~ });
			
			//~ _model.fetch().done(function(){
				//~ console.log("fetch.done");
				
				
				//~ var i = setInterval(function(){;
					this.toolContent.show(new dialogs.svg());
					//~ console.log("tick");
				//~ },100);
				//~ var t = window.setTimeout(function(){
					//~ window.clearInterval(i);
					//~ window.clearTimeout(t);
				//~ },1000);
				
			//~ });
		});
	},
});



module.exports =  dialogsView;
