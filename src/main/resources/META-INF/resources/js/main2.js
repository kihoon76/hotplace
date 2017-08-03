$(document).ready(function() {
	
	var _dom     = hotplace.dom;
	var _mapType = $('body').data('mtype');
	var _addrObj = {
		type   : 'R', //R: 도로명, N:지번주소
		si     : '',
		gugun  : '',
		region : ''
	}
	
	/*
	 * jquery handler 작성하기 전 로드가 먼저 되어야 함
	 * load 하는 부분은 가장 먼저 나와함
	 * */
	addressFormLoad();
	
	
	/**
	 * 주소 modal 컨트롤
	 */
	
	// 주소검색 도로명/지번 선택
	$('#addrType').on('click', function(e){
		_addrObj.type = $(e.target).data('type');
		
		_addrObj.si = '';
		_addrObj.gugun = '';
	});
	
	$('#selNsido').on('change', function(e) {
		var selObj = e.target;
		_addrObj.si = $(this).val();
		_addrObj.gugun = '';
		
		if(!_addrObj.si) {
			$('#selNgugun').html(_dom.getSelectOptions([], '시군구'));
		}
		else {
			hotplace.getPlainText('address/condition', _addrObj, function(data) {
				$('#selNgugun').html(_dom.getSelectOptions(data, '시군구'));
			},false);
		}
	});
	
	$('#selNgugun').on('change', function(e) {
		var selObj = e.target;
		_addrObj.gugun = $(this).val();
		_addrObj.region = '';
		
		if(!_addrObj.gugun) {
			$('#selName').html(_dom.getSelectOptions([], '지역명'));
		}
		else {
			hotplace.getPlainText('address/condition', _addrObj, function(data) {
				$('#selName').html(_dom.getSelectOptions(data, '지역명'));
			}, false);
		}
		
	});
	
	$('#selName').on('change', function(e) {
		var selObj = e.target;
		_addrObj.region = $(this).val();
	});
	
	
	//검색
	$('#btnNsearch').on('click', function(e) {
		hotplace.getPlainTextFromJson('address/search', JSON.stringify(_addrObj), function(data) {
			var output = $('#dvNresult');
			var dataForm = {
				'addresses': data
			}
			
			var result = (_dom.getTemplate('addressResult'))(dataForm);
			output.append(result);
		});
	});
	
	$('#btnViewMapAddress').on('click', function() {
		var $sel = $('input:radio[name="sel"]:checked');
		var lng = $sel.data('lng');
		var lat = $sel.data('lat');
		var address = $sel.data('address');
	
		hotplace.maps.panToBounds(lat, lng, null, function() {
			hotplace.dom.closeBootstrapModal('#addressSearch');
			hotplace.maps.getMarker(lat, lng, {
				'click' : function(map, newMarker, newInfoWindow) {
					 if(newInfoWindow.getMap()) {
						 newInfoWindow.close();
				     }
					 else {
						 newInfoWindow.open(map, newMarker);
				     }
				}
			}, address);
		});
	});
	
	/*****************************************************************************************************/
	
	//modal template loading
	function addressFormLoad() {
		var tForm = hotplace.dom.getTemplate('addressForm');
		$('#templateAddressModal').append(tForm());
	};
	
	hotplace.dom.enableLoadMask({el:$('body'), msg:'로딩 중입니다'});
	
	hotplace.maps.init('naver', {
		X: 127.9204629,
		Y: 36.0207091, 
		level: 3//12
	}, {
		'zoom_changed' : function(map, level) {
			console.log('changed ===> ' + level);
			//hotplace.database.initLevel(level);
			hotplace.maps.drawBounds();
			hotplace.maps.initHeatmap();
			hotplace.maps.showCellsLayer();
			
		},
		'zoom_start' : function(map, level) {
			console.log('start ====> ' + level)
			hotplace.database.initLevel(level);
			hotplace.test.initMarker(level);
		},
		'dragend' : function(map, bnds) {
			//console.log(bnds);
			hotplace.maps.drawBounds();
			hotplace.maps.appendCell();
		}
	}, function() {
		hotplace.maps.showCellsLayer();
		hotplace.maps.drawBounds();
	});
	
	hotplace.dom.addButtonInMap([{
		id: 'btnTest',
		dataAttr: 'data-on="마커보기" data-off="마커보기" data-switch="off"',
		type: 'check',
		title:'',
		callback: function(e) {
			var sw = $(this).data('switch');
			$(this).data('switch', ((sw == 'on') ? 'off' : 'on'));
			if(sw == 'off') {
				hotplace.test.showMarker();
			}
			else {
				hotplace.test.hideMarker();
			}
		}
	},{
		id: 'cadastral',
		dataAttr: 'data-on="지적도" data-off="지적도" data-switch="off"',
		type: 'check',
		title:'',
		callback: function() {
			var onOff = $(this).data('switch');
			hotplace.maps.showJijeokLayer(onOff, $(this));
		}
	}]);
});