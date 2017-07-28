$(document).ready(function($m, $v, $mapCore) {
	var _mapType = '';
	
	$mapCore.event.onMaploaded(function(map) {
		_mapType = $('body').data('mtype');
	});
	
	return {
		
	}
}(
	common.model,
	common.view,
	mapCore
));