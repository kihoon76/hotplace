/**
 * @namespace hotplace.location
 */
(function(location, $) {
	//location.
	var _viewGwansimInit = false;
	
	location.viewLLU = {
	}
	
	location.viewGwansim = {
		init: function() {
			if(_viewGwansimInit) return;
			
			$('#dvCateGwansim .save').click(function(){
				$('#dvCateGwansim .message').show();
			});
			$('#dvCateGwansim .confirm').click(function(){
				$('#dvCateGwansim .message').hide();
			});
		}	
	}
	
}(
	hotplace.location = hotplace.location || {},
	jQuery
));