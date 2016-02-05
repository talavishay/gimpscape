module.exports = function($){
		
	$.fn.measure = function(fn){
	var el = $(this).clone(false);
	el.css({
		visibility: 'hidden',
		position:   'absolute'
	}).appendTo('body');

	var result = fn.apply(el);
	el.remove();

	return result;

	}

}
