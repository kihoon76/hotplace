/**
 * @namespace hotplace.bosangpyeonib
 */
(function(bosangpyeonib, $) {
	
	bosangpyeonib.markerClick = function(map, marker, win) {
		var data = marker._data;
		win.open(map, marker);
	}
}(
	hotplace.bosangpyeonib = hotplace.bosangpyeonib || {},
	jQuery
));