'use strict';

var $ = require('jquery'),
    Marionette = require('backbone.marionette');


var TestView = Marionette.ItemView.extend({
    tagName: "span",
    template: require('./Test.html'),    
});

module.exports = TestView;

