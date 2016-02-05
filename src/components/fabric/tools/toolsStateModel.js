'use strict';
var Backbone = require('backbone');

var fabric = Backbone.Model.extend({
		defaults : {
			message : "@#$%^&*^%$#",
			visible : false,
			
			
		}
});

module.exports = fabric;
