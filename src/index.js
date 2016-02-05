'use strict';
//TODO:  clean up ... 
var $ = require('jquery');
window._ = require('underscore');
window.PouchDB = require('pouchdb');

(function() {
	var src = ('https:' === document.location.protocol ? 'https' : 'http') +
		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	
	$.getScript(src, function(data) {      
	//~ console.log(data);
	});
})();

var app = require('./app');

app.start();
