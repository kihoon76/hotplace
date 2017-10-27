/**
 * @namespace hotplace.bosangpyeonib
 */
(function(bosangpyeonib, $) {
	
	function _getThumb(data) {
		hotplace.ajax({
			url: 'bosangpyeonib/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: data.info.unu},
			loadEl: '#dvBosangPyeonib',
			success: function(data, textStatus, jqXHR) {
				//hotplace.dom.createChart('canvas');
				console.log(data);
				
				$('#bpMulgeonsojaeji').text(data.mulgeonsojaeji);
				$('#bpGonggogigwan').text(data.gonggogigwan);
				$('#bpGonggoil').text(data.gonggoil);
				$('#bpSaeobname').text(data.saeobname);
				$('#bpGonggobeonho').text(data.gonggobeonho);
				$('#bpSiseolkind').text(data.siseolkind);
				$('#bpSaeobsihaengja').text(data.saeobsihaengja);
			},
			error:function() {
				
			}
		});
	}
	
	bosangpyeonib.markerClick = function(map, marker, win, kind) {
		var data = marker._data;
		win.open(map, marker);
		
		var tForm = hotplace.dom.getTemplate('bosangpyeonibForm');
		
		win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm({kind:kind}));
		
		$('#btnBosangPyeonibClose').on('click', function() {
			win.close();
		});
		
		_getThumb(data);
	}
}(
	hotplace.bosangpyeonib = hotplace.bosangpyeonib || {},
	jQuery
));