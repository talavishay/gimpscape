
var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
	Radio = require('backbone.radio');

var layoutChannel = Radio.channel('fabric');

var Dialogs = require("./dialogs");

var fabricLayoutView = Marionette.LayoutView.extend({
	template :  require('./layout.html'),
	
	regions : {
		stage : '#stage',
		tools : '#tools',
		dialogs : "#dialogs"
	},
	onShow : function(ev){
		this.dialogs.show(new Dialogs);		
		//~ this.dialogs.currentView.collection.fetch();
		//~ console.log('fabric layout view onShow');
		//~ console.log(ev);
		this.$el.find("#fonInit").hide(1000);
		
		this.$el.find("img").on('click', 	function click_add_shape(e){
			var src = jQuery(e.currentTarget).attr("src");
			//~ var xscale = jQuery(".xscale").val();			//~ var yscale =	 jQuery(".yscale").val();
			var xscale = 1;
			var yscale =	1;

			App.canvas.add_svg(src, xscale, yscale);
	});
				//~ _.delay(function(text,el){
					//~ 
					//~ console.log(text);
				//~ }, 5000, 'logged later',this.$el)
	},
	
	
});


module.exports = fabricLayoutView;
