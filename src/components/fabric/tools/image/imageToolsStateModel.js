'use strict';
var Backbone = require('backbone');

var fabric = Backbone.Model.extend({
		initialize : function(object){
			if(object){
				this.set("textOpacity" , tinycolor(object.fill).getAlpha());
				var _shadow = object.getShadow();
				if(_shadow){
					var angle = Math.atan2(_shadow.offsetY, _shadow.offsetX); // get angle in radians
					var discontinuity = angle * (180.0 / Math.PI); // convert to degrees
					var degrees =  Math.round(180 + ( discontinuity * -1));// map to 0-360..
					this.set("curAngle", degrees  );
					
					var f = function lineDistance( point1, point2 ){
					  var xs = 0;
					  var ys = 0;
					 
					  xs = point2.x - point1.x;
					  xs = xs * xs;
					 
					  ys = point2.y - point1.y;
					  ys = ys * ys;
					 
					  return Math.sqrt( xs + ys );
					}
					var distance = f({x:0, y:0}, { x: _shadow.offsetX, y: _shadow.offsetY});
					this.set("curDistance", distance );
					
				} else {
					this.set("curDistance", 0 );
					this.set("curAngle", 180 );
				};
				this.set("zoomFactor",  object.width /  object.cw );
				this.set("zoomPercent",  ((Math.round((object.cw / object.width) * 100 )-100) * (-1)) * 2);
			};
			
			this.set("selectStrokeWidth",  this._selectInt(1, 50, 1,'---'));
			this.set("boxBorderWidth",  this._selectInt(1, 20, 1,'---'));
			
			
			
		},
		_selectInt : function(min, max, step, placeholder){
			var o = [];
			if(placeholder){o.push(placeholder);}
			for (var i = min ; i <= max ; i = i + step){
				o.push(i);
			}
			return o;
		},


});

module.exports = fabric;
