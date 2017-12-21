/**
 * @namespace hotplace.bosangpyeonib
 */
(function(bosangpyeonib, $) {
	
	function _getThumb(unu, callback) {
		hotplace.ajax({
			url: 'bosangpyeonib/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: unu},
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
				
				if(callback) callback(); 
			},
			error:function() {
				
			}
		});
	}
	
	function _getGroupMulgeonsojaeji(list) {
		hotplace.ajax({
			url: 'bosangpyeonib/group',
			method: 'POST',
			dataType: 'text',
			data: {gunu: list},
			loadEl: '#dvBosangPyeonib',
			success: function(data, textStatus, jqXHR) {
				//hotplace.dom.createChart('canvas');
				console.log(data);
				var jo = $.parseJSON(data);
				var list = jo.datas;
				var len = list.length;
				var $tbody = $('#tbBosangList tbody');
				var trs = '';
				for(var i=0; i<len; i++) {
					trs += '<tr data-unu="' +  list[i].unu + '">';
					trs += '<td>' + list[i].addr + '</td>';
					trs += '</td>';
				}
				
				$tbody.html(trs);
				$('#dvBosangPyeonibList tr').on('click', function(e) {
					var unu = $(this).data('unu');
					_changeView(false);
					_toggleButtonViewList();
					_getThumb(unu);
				});
				
				
			},
			error:function() {
				
			}
		});
	}
	
	function _changeView(isGrouped) {
		if(isGrouped) {
			$('#dvBosangPyeonibThumb').hide();
			$('#dvBosangPyeonibList').show();
		}
		else {
			$('#dvBosangPyeonibThumb').show();
			$('#dvBosangPyeonibList').hide();
		}
	}
	
	function _toggleButtonViewList(target) {
		var $btn = target || $('#btnBosangViewList');
		if($btn.hasClass('on')) {
			$btn.removeClass('on');
		}
		else {
			$btn.addClass('on');
		}
	}
	
	bosangpyeonib.markerClick = function(map, marker, win, kind) {
		var data = marker._data;
		var grpCnt = parseInt(data.info.xgc);
		var isGrouped = grpCnt >= hotplace.config.markerGrpCount;
		win.open(map, marker);
		
		var tForm = hotplace.dom.getTemplate('bosangpyeonibForm');
		
		//win.setOptions('maxWidth', 300);
		win.setOptions('content', tForm({kind:kind}));
		
		_changeView(isGrouped);
		
		$('#btnBosangPyeonibClose').on('click', function() {
			win.close();
		});
		
		$('#btnBosangViewList').on('click', function() {
			_changeView(true);
			_toggleButtonViewList($(this));
		});
		
		//그룹핑 된것인지 
		if(isGrouped) {
			_getGroupMulgeonsojaeji(data.info.gunu);
		}
		else {
			_getThumb(data.info.unu);
		}
		
	}

}(
	hotplace.bosangpyeonib = hotplace.bosangpyeonib || {},
	jQuery
));