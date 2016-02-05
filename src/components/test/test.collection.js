'use strict';

var Backbone = require('backbone');

var _collection = Backbone.Collection.extend({
  url : '/data.json',
  model: require('./test.models')
});


module.exports = _collection;
