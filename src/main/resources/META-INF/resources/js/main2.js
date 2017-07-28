$(document).ready(function() {
	
	hotplace.maps.event.onMapInited(function() {
		
	});
	
	hotplace.maps.init('daum', {
		X: 127.9204629,
		Y: 36.0207091, 
		level: 3
	}, {
		'zoom_changed' : function(map, level) {
			console.log(level);
		}
	});
});