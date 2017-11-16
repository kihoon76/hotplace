/**
 * @namespace hotplace.acceptbuilding
 */
(function(acceptbuilding, $) {
	
	
	function _bindDetailClickHandler(win) {
		
		//경매 물건상세보기 handler
		$('#btnAcceptbuildingDetail').on('click', function() {
			
		});
	}
	
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
		_getThumb(data);
	}
}(
	hotplace.acceptbuilding = hotplace.acceptbuilding || {},
	jQuery
));