/**
 * @namespace hotplace.gongmae
 */
(function(gongmae, $) {
	
	function _getThumb(data) {
		hotplace.ajax({
			url: 'gongmae/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: data.info.unu},
			loadEl: '#dvGongmae',
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				$('#gongMulgeonAddress').text(data.mulgeonAddress);
				$('#gongYongdo').text(data.yongdo);
				$('#gongJimok').text(data.jimok);
				$('#gongAreagubun').text(data.areaGubun);
				$('#gongMulgeonstatus').text(data.mulgeonStatus);
				$('#gongYuchal').text(data.yuchal);
			},
			error:function() {
				
			}
		});
	}
	
	/** 
	 * @memberof hotplace.gyeongmae 
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 */
	gongmae.markerClick = function(map, marker, win) {
		var data = marker._data;
		win.open(map, marker);
		var tForm = hotplace.dom.getTemplate('gongmaeForm');
		
		//win.setOptions('anchorSkew', true);
		win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm());
		
		$('#btnGongmaeClose').on('click', function() {
			win.close();
		});
		
		//_bindDetailClickHandler(win);
		_getThumb(data);
	}
}(
	hotplace.gongmae = hotplace.gongmae || {},
	jQuery
));