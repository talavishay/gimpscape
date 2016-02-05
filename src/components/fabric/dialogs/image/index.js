'use strict';
var Backbone = require("backbone"),
	BackbonePouch = require("backbone-pouch"),
	PouchDB = require('pouchdb'),
	//~ PouchBase = require('backbone-pouch-collection'),
	Radio = require('backbone.radio'),
	fabricToolsChannel = Radio.channel('fabricTools'),
	jQuery = require('jquery'),
	Marionette = require('backbone.marionette');

	
//~ Backbone.sync = BackbonePouch.sync({
	//~ db: new PouchDB('A')
//~ });
//~ Backbone.Model.prototype.idAttribute = '_id';

var _imageCollection = Backbone.Collection.extend({
	model: require("./model.js"),
	
    // Include docs in Map Reduce response. Order by `order`.
	sync: BackbonePouch.sync({
		db: new PouchDB('imagedialogModel'),
		fetch: 'query',
		listen: true,
		fetch: 'query',
		options: {
			query: {
				include_docs: true,
				fun: {
					map: function(doc) {
					emit(doc.order, null);
					}
				}
			},
			changes: {
				include_docs: true
			}
		}
    }),
    
    
    // parse view result, use doc property injected via `include_docs`
    parse: function(result) {
      return _.pluck(result.rows, 'doc');
    },

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }
	//~ db: App.db,
  
});
App._im = new _imageCollection();
App._im.fetch();
//~ this.collection.lisetnTo(App.fabricToolsChannel,"add:image", this._som);		
 
var imagesQueue = Marionette.CollectionView.extend({
	tagName: "table",
	collection: App._im,
	initialize : function(){
			
	        //~ this.collection.on('all', this.render, this);
	        //~ this.collection.on('add', this.render, this);
      	    //~ this.collection.on('reset', this.render, this);
      

	},    // Add a single todo item to the list by creating a view for it, and
    
	onShow : function(){	
		var fileInput = jQuery('<input type="file" multiple accept="image/*"/>');
		fileInput.on("change",this, this._handleFiles );
		
		jQuery(this.el).before(fileInput);
	
	
	
	},
	childView: require('./view.js'),
	_render : function(d){
	
		console.log(d);
	
	},
	_handleFiles : function (ev){
		var view = ev.data;
		var files = ev.currentTarget.files;
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			
			var reader = new FileReader();
			reader.onload = function(theFile) { 
			
					//~ fabricToolsChannel.trigger("add:image", theFile.target.result);
				file.theFile = theFile;
				console.log(theFile);
				//~ fabricToolsChannel.trigger("dialog:image:meta", file);
				view.collection.create({
							"name": theFile.target._file.name, 
							"size" : theFile.target._file.size, 
							"src" : theFile.target.result
				});
			};
		   reader._file = files[i];
			reader.readAsDataURL(file);
		}
	}
});

//~ module.exports = view;
module.exports = imagesQueue;
