/**
 * @namespace hotplace.acceptbuilding
 */
(function(acceptbuilding, $) {
	
	function _getThumb(data) {
		hotplace.ajax({
			url: 'acceptbuilding/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: data.info.unu},
			loadEl: '#dvAcceptbuilding',
			success: function(data, textStatus, jqXHR) {
				$('#aDaejiwichi').text(data.daejiwichi);
				$('#aAcceptgubun').text(data.acceptgubun);
				$('#aAcceptsingoil').text(data.acceptsingoil);
			},
			error:function() {
				
			}
		});
	}
	
	function _bindDetailClickHandler() {
		
		$('#dvAcceptbuilding .acceptbuilding-detail').on('click', function() {
			
		});
	}
	
	function _bindThumbClickHandler() {
		$('#btnAcceptbuildingThumb').on('click', function() {
			$('#tbAcceptbuildingThumb').show();
			$('#tbAcceptbuildingPano').hide();
		});
	}
	
	function _bindGeoClickHandler(x, y) {
		$('#btnAcceptbuildingPano').on('click', function() {
			$('#tbAcceptbuildingThumb').hide();
			$('#tbAcceptbuildingPano').show();
			hotplace.panomaps.createPanomaps('dvAcceptbuildingPano', x, y, true, function(location, msg) {
				$('#dvAcceptbuildingPanoInfo').html(msg);
			});
		});
	}
	
	/** 
	 * @memberof hotplace.acceptbuilding
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 */
	acceptbuilding.markerClick = function(map, marker, win) {
		var data = marker._data;
		win.open(map, marker);
		var tForm = hotplace.dom.getTemplate('acceptbuildingForm');
		
		//win.setOptions('anchorSkew', true);
		win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm());
		
		$('#btnAcceptbuildingClose').on('click', function() {
			win.close();
		});
		
		_bindDetailClickHandler(win);
		_bindGeoClickHandler(data.location[1], data.location[0]);
		_bindThumbClickHandler();
		_getThumb(data);
	}
}(
	hotplace.acceptbuilding = hotplace.acceptbuilding || {},
	jQuery
));