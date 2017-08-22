$(document).ready(function() {
	
	var _dom     = hotplace.dom;
	var _mapType = $('body').data('mtype');
	var _addrObj = {
		type   : 'R', //R: 도로명, N:지번주소
		si     : '',
		gugun  : '',
		region : ''
	}
	var _isSliderInit = false;
	
	/*
	 * jquery handler 작성하기 전 로드가 먼저 되어야 함
	 * load 하는 부분은 가장 먼저 나와함
	 * */
	//addressFormLoad();
	
	
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
			output.html(result);
		}, true, '#dvAddrSearch');
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
	
	$('#btnCapture').on('click', function(event) {
		event.preventDefault();
		hotplace.dom.captureToCanvas();
	});
	
	//slider init
	
	
	function _sliderInit(targetIds) {
		if(_isSliderInit) return;
		
		var len = targetIds.length;
		
		for(var i=0; i<len; i++) {
			$('#' + targetIds[i]).rangeSlider({
				  bounds: {min: 1, max: 10},
				  step: 1,
				  defaultValues: {min:1, max:4}
			});
		}
		
		_isSliderInit = true;
	}
	
	
	/*****************************************************************************************************/
	
	//modal template loading
	function addressFormLoad() {
		var tForm = hotplace.dom.getTemplate('addressForm');
		$('#templateAddressModal').append(tForm());
	};
	
	hotplace.maps.init('naver', {
		X: 127.9204629,
		Y: 36.0207091, 
		level: 3
	}, {
		'zoom_changed' : function(map, level) {
			hotplace.maps.showCellsLayer();
		},
		'zoom_start' : function(map, level) {
			//hotplace.test.initMarker(level);
		},
		'dragend' : function(map, bnds) {
			
			if(hotplace.maps.isInLocationBounds(bnds)) {
				hotplace.maps.appendCell();
			}
			else {
				hotplace.maps.showCellsLayer();
			}
		},
		'click' : function(map, latlng) {
			console.log(latlng)
			hotplace.maps.getClickedCell(latlng);
		},
		'tilesloaded': function() {
			console.log('tilesloaded');
		}
	}, function() {
		hotplace.maps.showCellsLayer();
	});
	
	
	function _btnCallback($this, e, targetId) {
		var sw = $this.data('switch');
		$this.data('switch', ((sw == 'on') ? 'off' : 'on'));
		
		if(sw == 'off') {
			var padding = 5;
			var top  = e.currentTarget.offsetTop;
			var left = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth + padding;
			
			hotplace.dom.openLayer(targetId, {top:top, left:left});
		}
		else {
			hotplace.dom.closeLayer(targetId);
		}
	}
	
	function tick() {
		$('#newsTicker li:first').slideUp(function() {
			$(this).appendTo($('#newsTicker')).slideDown();
		});
	}
	
	setTimeout(function repeat() {
		tick();
		setTimeout(repeat, 3000);
	}, 3000);
	
	hotplace.dom.addButtonInMap([/*{
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
	},*/{
		id:'btnNews',
		glyphicon: 'list-alt',
		attr: 'data-switch="off"',
		title:'',
		callback: function(e) {
			_btnCallback($(this), e, 'dvNews');
		}
	},{
		id:'btnAddrSearch',
		glyphicon: 'search',
		attr: 'data-switch="off"',
		title:'',
		callback: function(e) {
			_btnCallback($(this), e, 'dvAddrSearch');
		}
	},{
		id:'btnPinSearch',
		glyphicon: 'search',
		attr: 'data-switch="off"',
		title:'',
		callback: function(e) {
			_sliderInit(['sliderRQ', 
			             'sliderCon',
			             'sliderDev',
			             'sliderRealWidth',
			             'sliderRealPrice',
			             'sliderPop',
			             'sliderDevWidth',
			             'sliderParcel',
			             'sliderSales']);
			_btnCallback($(this), e, 'dvPinSearch');
		}
	},{
		id:'btnUser',
		glyphicon: 'user',
		title:'',
	},{
		id:'btnInfo',
		glyphicon: 'info-sign',
		title:'',
	},{
		id:'btnCadastral',
		attr: 'data-switch="off"',
		glyphicon: 'globe',
		title:'',
		callback: function() {
			var onOff = $(this).data('switch');
			hotplace.maps.showJijeokLayer(onOff, $(this));
		}
	}]);
});