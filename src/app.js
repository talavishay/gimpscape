'use strict';
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var	Radio = require('backbone.radio'),
	Marionette = require('backbone.marionette'),
	fabricToolsChannel = Radio.channel('fabricTools'),
	layoutChannel = Radio.channel('layout');
	

//~ Marionette Inspector chrome ext..
if (window.__agent) {  window.__agent.start(Backbone, Marionette)};

window.App = new Marionette.Application({
	onBeforeStart : function() {
		
		this.Radio = Radio;
		this.$ = Backbone.$;
		this.fabricToolsChannel = fabricToolsChannel;
		this.trig = function(command){
					fabricToolsChannel.trigger(command);
		}
		
		this.listenTo(fabricToolsChannel, "print", function(multiplier){
				window.open(window.App.canvas.toDataURL({
				  format: 'png',
				  multiplier: 5
				}), "_blank");
		});
		

		
		var layout = require('./components/layout');
		this.layout = new layout;
		this.layout.render();
	},
	onStart : function() {
		layoutChannel.trigger('set:content', require('./components/fabric')(App));
//~ if(Backbone.history) {Backbone.history.start({});		//~ }
	}
});

module.exports = window.App;

//~ window.App.notify  = function (text) {
			//~ var t = typeof text != "undefined" ? text :  "default text...";
			//~ var t = "XXXX";
			//~ var Notify = require('notifyjs');
            //~ function onShowNotification () {};
            //~ function onCloseNotification () {};
            //~ function onClickNotification () {};
            //~ function onErrorNotification () {};
            //~ 
            //~ function onPermissionDenied () { window.alert('denied ')};
            //~ 
            //~ function doNotification () {
                //~ var myNotification = new Notify("הודעה :", {
                    //~ body: t,
                    //~ tag: 'My unique id',
                    //~ notifyShow: onShowNotification,
                    //~ notifyClose: onCloseNotification,
                    //~ notifyClick: onClickNotification,
                    //~ notifyError: onErrorNotification,
                    //~ timeout: 4
                //~ });
//~ 
                //~ myNotification.show();
            //~ };
            //~ 
            //~ if (window.Notification && !Notify.needsPermission) {
                //~ doNotification();
            //~ } else if (Notify.isSupported()) {
                //~ Notify.requestPermission(doNotification, onPermissionDenied);
            //~ }
//~ };
//~ 
