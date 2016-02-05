'use strict';
var Backbone = require('backbone'),
	Radio = require('backbone.radio'),
	fabricToolsChannel = Radio.channel('fabricTools');
	
var model = Backbone.Model.extend({
		initialize : function(){
			var object = fabricToolsChannel.request('getActiveObject');
			var shadow = object.getShadow();
			if(object && shadow){
					this.set("curAngle", this.degrees(shadow)  );
					this.set("curDistance", this.lineDistance( { x: shadow.offsetX, y: shadow.offsetY}) );
					
				} else {
					this.set("curDistance", 0 );
					this.set("curAngle", 180 );
				};
			//~ }
		},
		lineDistance : function ( point2 ){
					  var xs = 0;
					  var ys = 0;
					 
					  //~ xs = point2.x - point1.x;
					  xs = point2.x ;
					  xs = xs * xs;
					 
					  //~ ys = point2.y - point1.y;
					  ys = point2.y ;
					  ys = ys * ys;
					 
					  return Math.sqrt( xs + ys );
		},
		degrees : function(shadow){
					var angle = Math.atan2(shadow.offsetY, shadow.offsetX); // get angle in radians
					var discontinuity = angle * (180.0 / Math.PI); // convert to degrees
					var degrees =  Math.round(180 + ( discontinuity * -1));// map to 0-360..
		}
});

module.exports = model;
