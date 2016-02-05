'use strict';
var Backbone = require('backbone');

var model = Backbone.Model.extend({
		url : '/src/svg',
		defaults : {
			"svgs" : [""]
		},
		parse : function(response, options){
			//~ var that = this;
			var s = [];
			this.set("svgs", s);
			_.forEach(response, function(val, key) {
				if(val.split('.')[1] == "svg"){
					s.push(val.toString());
					//~ that.set("svgs", s);
				}else{
					//~ console.log(val.toString());
				App.$.getJSON('http://localhost:3000/src/svg/'+val.toString(), function(data){
					//~ console.log(data);
					_.forEach(data, function(val2, key2) {
			
						if(val2.split('.')[1] == "svg"){
							s.push(val.toString()+ '/' + val2.toString());
						}
					});

				});
				}
				
				
			});
			this.set("svgs", s);
			
		}
});

module.exports = model;
