/**
 * @namespace hotplace.silgeolae
 */
(function(silgeolae, $) {
	
	function _getThumb(data) {
		console.log(data);
		$('#silYongdo').text(data.info.yongdo);
		$('#silJimok').text(data.info.jimok);
		$('#silGyeyagarea').text(data.info.gyeyagarea);
		$('#silGyeyagnyeonwol').text(data.info.gyeyagnyeonwol);
		$('#silGyeyagil').text(data.info.gyeyagil);
		$('#silGeolaegeumaeg').text(data.info.geolaegeumaeg.toString().money());
	}
	
	/** 
	 * @memberof hotplace.silgeolae 
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 */
	silgeolae.markerClick = function(map, marker, win) {
		var data = marker._data;
		win.open(map, marker);
		var tForm = hotplace.dom.getTemplate('silgeolaeForm');
		
		//win.setOptions('anchorSkew', true);
		win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm());
		
		$('#btnSilgeoraeClose').on('click', function() {
			win.close();
		});
		
		//_bindDetailClickHandler(win);
		console.log('------')
		console.log(data)
		_getThumb(data);
	}
}(
	hotplace.silgeolae = hotplace.silgeolae || {},
	jQuery
));