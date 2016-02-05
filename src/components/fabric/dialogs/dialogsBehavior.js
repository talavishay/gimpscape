var Marionette = require('backbone.marionette'),
	Radio = require('backbone.radio'),
	fabricToolsChannel = Radio.channel('fabricTools');

var Behavior = Marionette.Behavior.extend({
	events  : {
		"click .imageMaskBtn" : () => {
			fabricToolsChannel.trigger("dialog:imageMask");
		},
		"click .colorCorrectionBtn" : () => {
			fabricToolsChannel.trigger("dialog:colorCorrection");
		},
		"click .dropShadowBtn" : () => {
			fabricToolsChannel.trigger("dialog:dropShadow");
		},
		"click .closeDialog" : () => {
			fabricToolsChannel.trigger("dialog:close");
		}
	},
});

module.exports = Behavior;
