/**
 * This should export a function, which should return an instanciated
 * view (to avoid problems with require), and in your controlle
 * the method returned should be called.
 */
'use strict';


module.exports = function(app){
	
var fabricModel = require('./fabric.models'),
    fabricView = require('./fabric.views')(app),
    fabricLayoutView = require('./fabric.layout.view'),
    fabricToolsView = require('./tools'),
	toolsStateModel = require('./tools/toolsStateModel');

var myModel = new fabricModel();
var _toolsStateModel = new toolsStateModel();


var flv = fabricLayoutView.extend({
	onBeforeShow: function() {
		this.showChildView('stage', new fabricView({
			model : myModel
		}));

		this.showChildView('tools', new fabricToolsView({
				model : _toolsStateModel
		}));
	},
	events : {
		"keyup #fabric" : "test"
	},
	test : function(ev){
				console.log(ev.key);
	},
});


return flv;

}
