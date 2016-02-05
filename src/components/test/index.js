'use strict';

var Mn = require('backbone.marionette');
        
var _collectionView = Mn.CollectionView.extend({
	childView: require('../fabric/fabric.static.views'),
	collection : new (require('./test.collection')),
	initialize : function(){
		this.collection.fetch();
	}
});

module.exports = _collectionView
