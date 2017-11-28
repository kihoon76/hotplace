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
	
	function _bindDetailClickHandler() {
		
		$('#dvGongmae .gongmae-detail').on('click', function() {
			
		});
	}
	
	function _bindThumbClickHandler() {
		$('#btnGongmaeThumb').on('click', function() {
			$('#tbGongmaeThumb').show();
			$('#tbGongmaePano').hide();
		});
	}
	
	function _bindGeoClickHandler(x, y) {
		$('#btnGongmaePano').on('click', function() {
			$('#tbGongmaeThumb').hide();
			$('#tbGongmaePano').show();
			hotplace.panomaps.createPanomaps('dvGongmaePano', x, y, true, function(location, msg) {
				$('#dvGongmaePanoInfo').html(msg);
			});
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
		
		_bindDetailClickHandler(win);
		_bindGeoClickHandler(data.location[1], data.location[0]);
		_bindThumbClickHandler();
		_getThumb(data);
	}
}(
	hotplace.gongmae = hotplace.gongmae || {},
	jQuery
));