var Marionette = require('backbone.marionette'),
	_ = require('underscore'),
	Radio = require('backbone.radio'),
	fabricToolsChannel = Radio.channel('fabricTools');

var Behavior = Marionette.Behavior.extend({
		ui		:	{
			deleteObject: ".trash",
			cloneObject	: ".copyContent",
			pasteStyle 	: '.pasteStyle',
			copyStyle 	: '.copyStyle',
			sendBackwards	: ".sendBack",
			bringForward: ".bringForward",
			opacity : "select.opacity",
			stroke	: ".boxBorder",
			flipX	: ".flipX",
			flipY	: ".flipY",
			shadow 		: ".boxShadow",
			shadowOptions:	".options",
			
		},
		events 	:	{
			'click @ui.deleteObject' : 'deleteObject',
			'click @ui.cloneObject' : 'cloneObject',
			'click @ui.pasteStyle' : 'pasteStyle',
			'click @ui.copyStyle' : 'copyStyle',
			'click @ui.sendBackwards' : 'sendBackwards',
			'click @ui.bringForward' : 'bringForward',
			'change @ui.opacity' : 'setOpacity',
			'click @ui.stroke' 	: 'setStroke',
			'click @ui.flipX' : 'setFlipX',
			'click @ui.flipY' 	: 'setFlipY',			

			'click @ui.shadow' : 'setShadow',			
			'click @ui.shadowOptions' : 'toggleShadow'
			//~ "click" : () => {//~ fabricToolsChannel.trigger("dialog:imageMask");
			//~ },
		},
		deleteObject :function(){
		  App.canvas.remove(App.canvas.getActiveObject());
		},			
		cloneObject : function(){
			//TODO: object out of canvas test..
			var obj = fabricToolsChannel.request('getActiveObject');
				c = fabric.util.object.clone(obj),
				w = obj.canvas.getWidth()*0.6;
			c.set({
				top : (c.getTop() - c.getHeight())-Math.round(Math.random()*100),
				left : Math.round(Math.random()*w)+w/6,
				active : false
			});
			obj.canvas.add(c);
			fabricToolsChannel.trigger('renderall');
		}, 
		copyStyle : function(){
			fabricToolsChannel.request('getActiveObject').clone(function(clone){
					window._copyStyle = clone;
			});
		}, 
		pasteStyle : function(){
			if(window._copyStyle){
				var s = _.pick(window._copyStyle, 'shadow', "stroke", "strokeWidth", "fill");
				var obj = fabricToolsChannel.request('getActiveObject');
				obj = _.extend(obj, s);
				this.view.model.set(obj);
				this.view.render();
				fabricToolsChannel.trigger('renderall');
			}
		}, 
		bringForward : function(){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.bringToFront();
			fabricToolsChannel.trigger('renderall');
		}, 
		sendBackwards : function(){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.sendBackwards();
			fabricToolsChannel.trigger('renderall');
		},
		setOpacity : function(ev){
                var obj = fabricToolsChannel.request('getActiveObject');
                obj.setOpacity(parseFloat(ev.currentTarget.value));
                fabricToolsChannel.trigger('renderall');
        },
		setStroke : function (ev) {
				var obj = fabricToolsChannel.request('getActiveObject');
				if(obj.getStroke()){
					obj.setStroke(false);
				} else {
						obj.setStroke(true);
				}
				fabricToolsChannel.trigger('renderall');
		},
		setFlipX : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			if(obj.getFlipX()){
				obj.setFlipX(false);			
			} else {
				obj.setFlipX(true);
			}
			fabricToolsChannel.trigger('renderall');
		},
		setFlipY : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			obj.set('flipY', !obj.getFlipY());
			fabricToolsChannel.trigger('renderall');
		},
		setShadow : function(ev){
			var obj = fabricToolsChannel.request('getActiveObject');
			if(!obj.getShadow()){
				
				obj.setShadow({
					color:	'rgba(0,0,0,.8)',
					offsetX : obj.width*0.05,
					offsetY : obj.height*0.05,
					blur	: obj.width*0.1
				});
			} else {
				obj.setShadow('');
			}
			
			fabricToolsChannel.trigger('renderall');
		},
		toggleShadow : function(){
			var obj = fabricToolsChannel.request('getActiveObject');
			if(obj.getShadow() === null){
				this.setShadow();	
				this.view.model.set(obj);
				this.view.render();
			}
			this.$el.find(".shadowOptions").toggle();
		},
		
});

module.exports = Behavior;
