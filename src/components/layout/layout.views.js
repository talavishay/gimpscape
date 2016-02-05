'use strict';

var $ = require('jquery'),
    Radio = require('backbone.radio'),
    _ = require('underscore'),
    Mn = require('backbone.marionette');

var layoutChannel = Radio.channel('layout');

var AppLayout = Mn.LayoutView.extend({
    el : 'body',
    template:  require('./layout.html'),
    regions: {
        fabric: '#fabric-region',
    },
    
    initialize: function() {
        this.listenTo(layoutChannel, 'set:content', function(ContentView) {
			 this.fabric.show(new ContentView);
		});
        
    },
    onBeforeDestroy: function() {
        Radio.reset('layout');
    }
});


module.exports = AppLayout;
