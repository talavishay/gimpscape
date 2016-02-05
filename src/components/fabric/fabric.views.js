'use strict';

var $ = require('jquery'),
	Marionette = require('backbone.marionette'),
	Radio = require('backbone.radio'),
	fabric = require('./fabric.custom.js'),
	Notify = require('notifyjs'),
	fabricToolsChannel = Radio.channel('fabricTools');

module.exports = function(app){
	var fabricView = Marionette.ItemView.extend({
		tagName 	: 'canvas',
		template	: false,
		//~ behaviors: [
			//~ { behaviorClass: require('./Behavior_1.js')},
			//~ { behaviorClass: require('./Behavior_2.js')}],

		onShow 		: function(){	
			var canvas = new fabric.Canvas(this.el,{
					width : this.model.get('width'),
					height : this.model.get('height')
			});
			this.canvas = canvas;
			window.App.canvas = canvas;
			fabricToolsChannel.reply('getActiveObject', function(requestName) {
				return canvas.getActiveObject();
			});	
			fabricToolsChannel.reply('getActiveGroup', function(requestName) {
				return canvas.getActiveGroup() ? canvas.getActiveGroup() : canvas.getActiveObject();
			});	
		
			this.listenTo(fabricToolsChannel, "renderall", function(){
				console.log("renderall");
				canvas.renderAll();			
			});
			this.listenTo(fabricToolsChannel, "rebuildCanvas", function(){
				console.log("rebuildCanvas");
				canvas.renderAll();
				var obj = canvas.getActiveObject();
				var id = canvas.getObjects().indexOf(obj);
				var data = canvas.toJSON();
				canvas.loadFromJSON(data);
				canvas.renderAll();
				var active = canvas.getObjects()[id];
				canvas.setActiveObject(active);
				fabricToolsChannel.trigger("show", {canvas : canvas, target : active});
			});
			this.listenTo(fabricToolsChannel, "add:text", this.addText);
			this.listenTo(fabricToolsChannel, "object:clip", this.clipSvg);
			this.listenTo(fabricToolsChannel, "object:move", this.objectMove);
			this.listenTo(fabricToolsChannel, "add:background", this.dataURItoBackground);
			this.listenTo(fabricToolsChannel, "add:image", this.addImage);
			this.listenTo(fabricToolsChannel, "object:delete", this.objectDelete);
					
			this._Events();
			this.demo();
			
			//todo: REMOVE APP SINGLE CANVAS ATTACHMENT ???
			//todo: layers ? App.Layer.push / app.page.push("layer", canvas) ? ...
			
	
		},
		objectDelete : function(){
			App.canvas.remove(App.canvas.getActiveObject());
		},
		
		objectMove 	: function(ev){
			if(ev){
				var obj = fabricToolsChannel.request('getActiveObject'),
					//animation options for the movment
					options = {
						duration: 250,
						easing :  fabric.util.ease["easeOut"],
						onChange: App.canvas.renderAll.bind(App.canvas),
					},
					//TODO: steps to move -- pixels ?
					step = 20;
				//~ var t = 'type:' + 		obj.type 						//~ +'\nleft:' + 	parseInt(obj.left)	+' | top:' + Math.round(obj.top)						//~ +'\nscaleX:' 	+ obj.scaleX +' | scaleY:' + obj.scaleY						//~ +'\nwidth:' 	+ obj.width	+' | height:' + obj.height;
				switch (ev){
					
					case  "left":
						obj.animate('left', '-=' + step  , options);
					break;
					case "right":
						obj.animate('left', '+=' + step  , options);
					break;
					case "down":
						obj.animate('top', '+=' +  step  , options);
					break;
					case "up":
						obj.animate('top', '-=' + step  , options);
					break;
				}
			}

		},
		_Events 	: function(){
			$(document).on("keyup", function(ev){
				console.log(ev.keyCode);
				//~ ev.preventDefault();
				switch (ev.keyCode){
					
				case 8:// keyboard key = del?
				case 46:// keyboard key = backs[pce]?
					fabricToolsChannel.trigger("object:delete");
				break;
					
				case 37:// keyboard key = LEFT 
					fabricToolsChannel.trigger("object:move", "left");
				break;
					
				case 37:// keyboard key = LEFT 
					fabricToolsChannel.trigger("object:move", "left");
				break;
				case 39:// keyboard key = RIGHT
					fabricToolsChannel.trigger("object:move", "right");
				break;
				case 40:// keyboard key = DOWN 
					fabricToolsChannel.trigger("object:move", "down");
				break;
				case 38:// keyboard key = UP
					fabricToolsChannel.trigger("object:move", "up");
				break;
				
				case 49:// keyboard key = 1
					fabricToolsChannel.trigger("add:image", "DSC_0193.JPG");
				break;
				
				case 50:// keyboard key = 2
					fabricToolsChannel.trigger("dialog:colorCorrection");
				break;
				case 51:// keyboard key = 3
					fabricToolsChannel.trigger("dialog:dropShadow");
				break;
				case 52:// keyboard key = 4
					fabricToolsChannel.trigger("dialog:imageMask");
				break;
				case 53:// keyboard key = 5
					fabricToolsChannel.trigger("dialog:svg");
				break;
				case 54:// keyboard key = 6
					fabricToolsChannel.trigger("dialog:image");
				break;
				case 55:// keyboard key = 7
					fabricToolsChannel.trigger("add:text", "נורי טל :)");
				break;
				case 56:// keyboard key = 8
					fabricToolsChannel.trigger("dialog:position");
				break;
				case 57:// keyboard key = 9
					fabricToolsChannel.trigger("dialog:show");
				break;
				case 48:// keyboard key = 0
					fabricToolsChannel.trigger("dialog:close");
					fabricToolsChannel.trigger("hide");
				break;
				case 80:// keyboard key = פ P
					fabricToolsChannel.trigger("print");
				break;
				case 81:// keyboard key = q
					var data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/gD+AP7rGNSCAAAACW9GRnMAAAArAAAABADTLYY/AAAACXBIWXMAAABIAAAASABGyWs+AAAAbXpUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHjaVYurEcAwDMW4p/AIz5/YyTxJQFlB97+C/lLdCQiItv3oxMzMHJWsunrzAZsTHwO9eGpIzLRESGqUmGHZgOUZz0CAAPB6t1z++x0dKwoAdALhOR/KPmV3OQAAAAl2cEFnAAAADgAAAA4AsVvx9wAAACpJREFUKM9jfMjA8J+BDMACpRlJ1PefiRzbGBgYGEY1jmokD8DSKskJHQDm2AP/6ncBAAAAABZ0RVh0bGFiZWwAb3V0bGluZSAjM19ia2duZBth3F4AAAAASUVORK5CYII=';
					fabricToolsChannel.trigger("add:background", data);
				break;
				case 87:// keyboard key = q
					var data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/gD+AP7rGNSCAAAACW9GRnMAAAArAAAABADTLYY/AAAACXBIWXMAAABIAAAASABGyWs+AAAAbXpUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHjaVYurEcAwDMW4p/AIz5/YyTxJQFlB97+C/lLdCQiItv3oxMzMHJWsunrzAZsTHwO9eGpIzLRESGqUmGHZgOUZz0CAAPB6t1z++x0dKwoAdALhOR/KPmV3OQAAAAl2cEFnAAAADgAAAA4AsVvx9wAAACpJREFUKM9jfMjA8J+BDMACpRlJ1PefiRzbGBgYGEY1jmokD8DSKskJHQDm2AP/6ncBAAAAABZ0RVh0bGFiZWwAb3V0bGluZSAjM19ia2duZBth3F4AAAAASUVORK5CYII=';
					fabricToolsChannel.trigger("add:image", data);
				break;
				}
				//~ return false;
			});
			this.canvas.on( 'object:modified', this.showTools);
			this.canvas.on( 'object:selected', this.showTools);
			this.canvas.on( 'mouse:up', this.showTools);
			
			this.canvas.on( 'selection:cleared', this.hideTools);
			this.canvas.on( 'object:rotating', this.hideTools);
			this.canvas.on( 'object:moving',  this.hideTools);
		},
		showTools 	: function(options){		
			fabricToolsChannel.trigger("hide");
			fabricToolsChannel.trigger("show");
				
		},
		hideTools 	: function(){
			fabricToolsChannel.trigger("hide");
			fabricToolsChannel.trigger("dialog:close");
			
		},
		demo 		: function(){
			var that = this;// "add" rectangle onto canvas
			var rectg = new fabric.Rect({
					left: 100,
					top: 100,
					fill: 'rgb(255,0,0)',
					width: 120,
					height: 40,
					ry : 10,
					rx : 10
					
					
			});
			var triangleg = new fabric.Triangle({
			  left: 100,
			  top: 100,
			  width: 40,
			  height: 40,
			  fill: 'blue'
			});
			var group = new fabric.Group([ rectg, triangleg ], {
			  left: 50,
			  top: 400,
			  angle: 20,
			});
			var rect = new fabric.Rect({
					left: 100,
					top: 500,
					fill: 'rgba(0,255,0,.8)',
					width: 120,
					height: 40,		
					  shadow: 'rgba(0,0,0,0.4) 5px 5px 7px'		
			});    
			rect.setStroke(true);
			rect.setStrokeWidth(2);
			var triangle = new fabric.Triangle({
			  left:300,
			  top: 450,
			  width: 40,
			  height: 40,
			  fill: 'yellow'
			});
			var fImg = this.addImage('DSC_0193.JPG');
			
			var options = {
					duration: 1000,
					easing :  fabric.util.ease["easeOutBounce"],
					onChange: this.canvas.renderAll.bind(this.canvas)
				};
			
			//~ fImg.setShadow({
					//~ color:	'rgba(0,0,0,.8)',
					//~ offsetX : 5,
					//~ offsetY : 15,
					//~ blur	: 10
				//~ });
				//~ //fImg.setCrossOrigin('anonymous');
				//~ var l = window.App.canvas.getWidth() - fImg.getWidth()/2-20;	
				//~ var h = window.App.canvas.getHeight() - fImg.getHeight()/2-200;
				//~ 
				//~ fImg
					//~ .animate('left', '=' + l,	options)
					//~ .animate('top', '=' + h,	options);
			//~ 
			//~ var imgElement = document.getElementById('nuri');
			//~ var image = new fabric.Image(imgElement);
			
			fabric.Image.fromURL('/DSC_0193.JPG', function(oImg) {
				oImg.set({
					scaleX:0.5,
					scaleY:0.5,
					stroke : 'black',
			//~ e		//~ strokeWidth : 10,
					//~ clipTo: function (ctx) {
						//~ ctx.arc(0, 0, oImg.width/4, 0, Math.PI * 2, true);
					//~ }
				});
				that.canvas.add(oImg);	
			});
			 this.canvas.add(group, rect, triangle);	
		},
		addImage 	: function(src, options){
			var canvas = window.App.canvas;
			var img = new Image(),
				options = {//TODO: options args..
					originX : 'center', 	originY : 'center',
					left : canvas.width/2,	top : canvas.height/2,
					width: canvas.width/4,	height : canvas.height/4
					//~ ry : 1000,				rx : 1000,
					//~ scaleX:,				scaleY:0.5	
				};
					
			img.onload = function() {
				var fImg = new fabric.Cropzoomimage(this, options),
					canvas = window.App.canvas;
				canvas
					.add(fImg)
					.setActiveObject(fImg);
			};
			img.src = src;			
		},
		addText 	: function(text){
			var text = new fabric.IText(text, {
				caching : false,
				fontFamily : 'nootregular',
				fontSize: 175,
				textAlign: "right",
				fill: 'rgba(255,255,0,1)',
				originX : 'center',
				originY : 'center',
			}),
			w = App.canvas.width*2,
			h = App.canvas.height*2,
			options = {
				duration: 200,
				easing :  fabric.util.ease["easeOutBounce"],
				onChange: App.canvas.renderAll.bind(App.canvas),
			};
			text.set({
				left : -text.width  , 
				top: -text.height,
				stroke : 101,
				shadow : {
					color:	'rgba(0,0,0,1)',
					offsetX : -2,
					offsetY : 2,
					blur	: 15	
				},
				//~ left : -App.canvas.width  , 
			});
			App.canvas.add(text);	
			text.animate('top', '=' + _.random(0, h) ,options);			
			text.animate('left', '='+ _.random(0, w), options);
		},
		clipSvg	:	function(src,yscale,xscale){
				
			//~ var canvas = window.App.canvas.getActiveCanvas(canvas);
			//if(active.clipTo === null){
			fabric.loadSVGFromURL(src, function(objects, options) {
				var active = App.canvas.getActiveObject();
				
				if (objects.length > 1) {
					var loadedObject = new fabric.PathGroup(objects, options);
				} else {
					var loadedObject = objects[0];
				}
			
				loadedObject.set({
					left: 0,
					top	: 0,
					originX : 'center',
					originY : 'center',
					//angle : active.angle,
					scaleY: (active.height / loadedObject.height) * yscale,
					scaleX: (active.width / loadedObject.width) * xscale,
					//~ height: active.height,
					//~ width: active.width 
					
				});
			
				active.set({ 
					clipTo: function(ctx) {
						loadedObject.render(ctx);
					}
				});
				//~ canvas.calcOffset();
				App.canvas.renderAll();
					
			});
		},
		
		dataURItoBackground	:	function (data){
			var canvas = App.canvas,
				options = {
					originX : 'center', 
					originY : 'center',
					left : canvas.width/2,
					top : canvas.height/2,
				};
		
			canvas.setBackgroundImage(data, canvas.renderAll.bind(canvas), options);
		},
		
		dataURItoBlob : function(dataURI) {
			// convert base64 to raw binary data held in a string
			var byteString = atob(dataURI.split(',')[1]);
		 
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		 
			// write the bytes of the string to an ArrayBuffer
			var arrayBuffer = new ArrayBuffer(byteString.length);
			var _ia = new Uint8Array(arrayBuffer);
			for (var i = 0; i < byteString.length; i++) {
				_ia[i] = byteString.charCodeAt(i);
			}
		 
			var dataView = new DataView(arrayBuffer);
			var blob = new Blob([dataView], { type: mimeString });
			return blob;
		}
		
	});
		return fabricView;
};
//~ onRender : function(){
//~ //		window.App.notify("canvas Width :" +  this.model.get('width') + "\ncanvas Heigth : " + this.model.get('heigth'));
//~ 
//~ },
var canvas = App.canvas;
