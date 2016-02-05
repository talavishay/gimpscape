'use strict';
var Backbone = require('backbone');

var fabric = Backbone.Model.extend({
		defaults : {
			//~ width	:  window.innerWidth*.95,
			//~ height	:  window.innerHeight*.95
			width	:  window.innerWidth*.99,
			height	:  window.innerHeight*.99
		}
});

module.exports = fabric;
