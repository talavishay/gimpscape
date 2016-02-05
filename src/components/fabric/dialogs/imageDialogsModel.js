'use strict';
var Backbone = require('backbone');

var fabric = Backbone.Model.extend({
		defaults : {		
			visible : false
		},
		initialize : function(object){
			this.set("selectOpacity",  this._selectFloat(0, 10, 1));
			this.set("selectStrokeWidth",  this._selectInt(1, 10, 1,'---'));
				//~ var _shadow = object.getShadow();
				//~ if(_shadow){
					//~ var angle = Math.atan2(_shadow.offsetY, _shadow.offsetX); // get angle in radians
					//~ var discontinuity = angle * (180.0 / Math.PI); // convert to degrees
					//~ var degrees =  Math.round(180 + ( discontinuity * -1));// map to 0-360..
					//~ this.set("curAngle", degrees  );
					//~ 
					//~ var f = function lineDistance( point1, point2 ){
					  //~ var xs = 0;
					  //~ var ys = 0;
					 //~ 
					  //~ xs = point2.x - point1.x;
					  //~ xs = xs * xs;
					 //~ 
					  //~ ys = point2.y - point1.y;
					  //~ ys = ys * ys;
					 //~ 
					  //~ return Math.sqrt( xs + ys );
					//~ }
					//~ var distance = f({x:0, y:0}, { x: _shadow.offsetX, y: _shadow.offsetY});
					//~ this.set("curDistance", distance );
					//~ 
				//~ } else {
					//~ this.set("curDistance", 0 );
					//~ this.set("curAngle", 180 );
				//~ };
		},
		_selectInt : function(min, max, step, placeholder){
			var o = [];
			if(placeholder){o.push(placeholder);}
			for (var i = min ; i <= max ; i = i + step){
				o.push(i);
			}
			return o;
		},
		_selectFloat : function(min, max, step, placeholder){
			var o = [];
			if(placeholder){o.push(placeholder);}
			for (var i = min ; i <= max ; i = i + step){
				o.push(i/10);
				
			}
			return o;
		}
});

module.exports = fabric;
