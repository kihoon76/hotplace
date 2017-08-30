$(document).ready(function() {
	
	var _dom     = hotplace.dom;
	var _mapType = $('body').data('mtype');
	var _addrObj = {
		type    : 'N', 	   //R: 도로명, N:지번주소
		si      : '',
		gugun   : '',
		region  : '',
		detail  : '',
		rdoId   : 'rdoN', //result radio name [rdoR, rdoN]
		san     : '1',    //1:일반, 2:산
		beonjiF : '',     //지번 앞자리
		beonjiS : ''      //지번 뒷자리
	};
	
	var _addrObjRadius = {
		type    : 'N', 			 //R: 도로명, N:지번주소
		si      : '',
		gugun   : '',
		region  : '',
		detail  : '',
		rdoId   : 'rdoNradius',  //result radio name [rdoRradius, rdoNradius]
		san     : '1',     		 //1:일반, 2:산
		beonjiF : '',     		 //지번 앞자리
		beonjiS : ''      		 //지번 뒷자리
	};
	
	var _sliderGrpInit = {};
	var _startInternal;
	var _buttonsThreshold = {};	//button 특정레벨에서 비활성화
	/*
	 * jquery handler 작성하기 전 로드가 먼저 되어야 함
	 * load 하는 부분은 가장 먼저 나와함
	 * */
	_searchFormLoad();
	_salesViewFormLoad();
	
	function _enableMapButton(level, targetBtnId) {
		var target = $('#' + targetBtnId);
		
		if(level >= 8) {
			if(_buttonsThreshold[targetBtnId]) return;
			target.removeAttr('disabled');
			target.toggleClass('button-disabled');
			_buttonsThreshold[targetBtnId] = true;
		}
		else {
			if(_buttonsThreshold[targetBtnId]) {
				target.prop('disabled', true);
				
				if(target.hasClass('button-on')) {
					target.trigger('click');
				}
				
				target.toggleClass('button-disabled');
				_buttonsThreshold[targetBtnId] = false;
			}
		}
	}
	
	function _sliderInit(gName, targetIds) {
		if(_sliderGrpInit[gName]) return;
		
		var len = targetIds.length;
		
		for(var i=0; i<len; i++) {
			$('#' + targetIds[i]).rangeSlider({
				  bounds: {min: 1, max: 10},
				  step: 1,
				  defaultValues: {min:1, max:4}
			});
		}
		
		_sliderGrpInit[gName] = true;
	}
	
	function _searchFormLoad() {
		var tForm = hotplace.dom.getTemplate('searchForm');
		$('#dvAddrSearch').append(tForm());
	}
	
	function _salesViewFormLoad() {
		var tForm = hotplace.dom.getTemplate('salesViewForm');
		$('#dvSalesView').append(tForm());
	}
	
	function _btnCallback($this, e, targetId, onFn, offFn) {
		var sw = $this.data('switch');
		$this.data('switch', ((sw == 'on') ? 'off' : 'on'));
		
		if(sw == 'off') {
			var padding = 5;
			var top  = e.currentTarget.offsetTop;
			var left = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth + padding;
			
			hotplace.dom.openLayer(targetId, {top:top, left:left});
			if(onFn) onFn();
		}
		else {
			hotplace.dom.closeLayer(targetId);
			if(offFn) offFn();
		}
		
		$this.toggleClass('button-on');
	}
	
	function _tick() {
		$('#newsTicker li:first').slideUp(function() {
			$(this).appendTo($('#newsTicker')).slideDown();
		});
	}
	
	function _validateSelectAddr(sels) {
		var len = sels.length;
		var dom = hotplace.dom;
		
		for(var i=0; i<len; i++) {
			if($(sels[i]).val() == '') {
				dom.openTooltip(sels[i]);
				return false;
			}
		}
		
		return true;
	}
	
	/* 검색 > 상세검색 탭 클릭시 slider init */
	$('#dvAddrSearch a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		  if(target == '#tabDetailSearch') {
			  _sliderInit('tabDetailSearch', [
			              'sliderRQ', 
				          'sliderCon',
				          'sliderDev',
				          'sliderRealWidth',
				          'sliderRealPrice',
				          'sliderPop',
				          'sliderDevWidth',
				          'sliderParcel',
				          'sliderSales']
			  );  
		  }
		  
		  hotplace.dom.closeAllTooltip('.htooltip');
	});
	
	// 주소검색 도로명/지번 선택
	$('#addrType, #addrTypeRadius').on('click', function(e){
		var addrObject = (e.currentTarget.id == 'addrType') ? _addrObj : _addrObjRadius;
		
		addrObject.type = $(e.target).data('type');
		addrObject.si = '';
		addrObject.gugun = '';
		addrObject.rdoId = $(e.target).data('rdo');
	});
	
	$('#selNsido, #selNsidoRadius').on('change', function(e) {
		var addrObject, targetId, thisId = e.currentTarget.id;
		
		//tooltip 닫기
		hotplace.dom.closeTooltip('#' + thisId);
		
		if(thisId == 'selNsido') {
			addrObject = _addrObj;
			targetId = '#selNgugun';
		}
		else {
			addrObject = _addrObjRadius;
			targetId = '#selNgugunRadius';
		}
		
		addrObject.si = $(this).val();
		addrObject.gugun = '';
		
		if(!addrObject.si) {
			$(targetId).html(_dom.getSelectOptions([], '시군구'));
		}
		else {
			hotplace.getPlainText('address/condition', addrObject, function(data) {
				$(targetId).html(_dom.getSelectOptions(data, '시군구'));
			},false);
		}
	});
	
	$('#selNgugun, #selNgugunRadius').on('change', function(e) {
		var addrObject, targetId, thisId = e.currentTarget.id;
		
		hotplace.dom.closeTooltip('#' + thisId);
		
		if(thisId == 'selNgugun') {
			addrObject = _addrObj;
			targetId = '#selName';
		}
		else {
			addrObject = _addrObjRadius;
			targetId = '#selNameRadius';
		}
		
		addrObject.gugun = $(this).val();
		addrObject.region = '';
		
		if(!addrObject.gugun) {
			$(targetId).html(_dom.getSelectOptions([], '지역명'));
		}
		else {
			hotplace.getPlainText('address/condition', addrObject, function(data) {
				$(targetId).html(_dom.getSelectOptions(data, '지역명'));
			}, false);
		}
	});
	
	$('#selName, #selNameRadius').on('change', function(e) {
		var thisId = e.currentTarget.id;
		var addrObject = (thisId == 'selName') ? _addrObj : _addrObjRadius;
		
		hotplace.dom.closeTooltip('#' + thisId);
		addrObject.region = $(this).val();
	});
	
	
	$('#chkSan, #chkSanRadius').on('change', function(e) {
		var target = e.currentTarget;
		var addrObject = (target.id == 'chkSan') ? _addrObj : _addrObjRadius;
		
		if(target.checked) {
			addrObject.san = '2';
		}
		else {
			addrObject.san = '1';
		}
	});
	
	//검색
	$('#btnNsearch, #btnNsearchRadius').on('click', function(e) {
		var addrObject, outputId, vArr, mapViewId;
		if(e.currentTarget.id == 'btnNsearch') {
			addrObject = _addrObj;
			outputId = '#dvNresult'; 
			mapViewId = '#btnViewMapAddress';
			vArr = ['#selNsido', '#selNgugun', '#selName'];
			addrObject.beonjiF = $('#beonjiF').val();
			addrObject.beonjiS = $('#beonjiS').val();
		}
		else {
			addrObject = _addrObjRadius;
			outputId = '#dvNresultRadius';
			mapViewId = '#btnViewMapAddressRadius';
			vArr = ['#selNsidoRadius', '#selNgugunRadius', '#selNameRadius'];
			addrObject.beonjiF = $('#beonjiFradius').val();
			addrObject.beonjiS = $('#beonjiSradius').val();
		}
		
		//지도에서 보기 버튼 툴팁 제거
		hotplace.dom.closeTooltip(mapViewId);
		
		if(_validateSelectAddr(vArr)) {
			
			hotplace.getPlainTextFromJson('address/search', JSON.stringify(addrObject), function(data) {
				var output = $(outputId);
				var dataForm = {
					'addresses': data,
					'rdoId': addrObject.rdoId
				}
				
				var result = (_dom.getTemplate('addressResult'))(dataForm);
				output.html(result);
			}, true, '#dvAddrSearch');
		}
	});
	
	$('#btnViewMapAddress, #btnViewMapAddressRadius').on('click', function(e) {
		var id = e.currentTarget.id; 
		var addrObj = (id == 'btnViewMapAddress') ? _addrObj : _addrObjRadius;
		var $sel = $('input:radio[name="' + addrObj.rdoId + '"]:checked');
		var lng = $sel.data('lng');
		var lat = $sel.data('lat');
		var address = $sel.data('address');
		var radius = 0;
		
		if(!address) {
			hotplace.dom.openTooltip('#' + id);
			return;
		}
		
		if(id == 'btnViewMapAddressRadius') {
			//반경선택 결과
			radius = $('input:radio[name="radioRadius"]:checked').val();
		}
		
		hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerType.RADIUS_SEARCH);
		
		hotplace.maps.panToBounds(lat, lng, null, function() {
			hotplace.maps.destroyMarkerType(hotplace.maps.MarkerType.RADIUS_SEARCH);
			
			hotplace.maps.getMarker(hotplace.maps.MarkerType.RADIUS_SEARCH, lat, lng, {
				'click' : function(map, newMarker, newInfoWindow) {
					 if(newInfoWindow.getMap()) {
						 newInfoWindow.close();
				     }
					 else {
						 newInfoWindow.open(map, newMarker);
				     }
				}
			}, {
				hasInfoWindow: true,
				infoWinFormName: 'pinpointForm',
				radius: radius,
				datas: {content: address}
			});
		});
	});
	
	$('#btnCapture').on('click', function(event) {
		event.preventDefault();
		hotplace.dom.captureToCanvas();
	});
	
	/*****************************************************************************************************/
	
	hotplace.maps.init('naver', {
		X: 127.9204629,
		Y: 36.0207091, 
		level: 3
	}, {
		'zoom_changed' : function(map, level) {
			hotplace.maps.showCellLayer();
			_enableMapButton(level, 'btnSalesView');
		},
		'zoom_start' : function(map, level) {
			////hotplace.test.initMarker(level);
			hotplace.maps.destroyMarkers();
			hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerType.RADIUS_SEARCH);
		},
		'dragend' : function(map, bnds) {
			
			if(hotplace.maps.isInLocationBounds(bnds)) {
				hotplace.maps.appendCell();
			}
			else {
				hotplace.maps.showCellLayer();
			}
		},
		'click' : function(map, latlng) {
			console.log(latlng)
			hotplace.maps.getClickedCell(latlng);
		},
		'tilesloaded': function() {
			console.log('tilesloaded');
		}
	}, function(map) {
		hotplace.maps.showCellLayer();
		hotplace.dom.showYearRangeDiv();
	});
	
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
		callback: function(e) {
			_btnCallback($(this), e, 'dvNews', function() {
				setTimeout(function repeat() {
					_tick();
					_startInternal = setTimeout(repeat, 3000);
				}, 3000);
			},function() {
				clearTimeout(_startInternal);
			});
		}
	},{
		id:'btnAddrSearch',
		glyphicon: 'search',
		attr: 'data-switch="off"',
		callback: function(e) {
			_btnCallback($(this), e, 'dvAddrSearch');
		}
	},{
		id:'btnUser',
		glyphicon: 'user',
		callback: function() {
			hotplace.dom.captureToCanvas();
		}
	},{
		id:'btnInfo',
		glyphicon: 'info-sign',
		attr: 'data-switch="off"',
		callback: function(e) {
			hotplace.test.searchRadius();
			//_btnCallback($(this), e, 'dvInfo');
		}
	},{
		id:'btnSalesView',
		glyphicon:'check',
		attr: 'data-switch="off" title="test"',
		disabled: true,
		clazz: 'mBtnTooltip',
		callback: function(e) {
			_btnCallback($(this), e, 'dvSalesView');
		}
	},{
		id:'btnCadastral',
		attr: 'data-switch="off"',
		glyphicon: 'globe',
		callback: function() {
			var onOff = $(this).data('switch');
			hotplace.maps.showJijeokLayer(onOff, $(this));
			$(this).toggleClass('button-on')
		}
	}]);
	
	hotplace.validation.numberOnly('.numberOnly');
	hotplace.dom.initTooltip('htooltip');
	hotplace.dom.initTooltip('mBtnTooltip',{side: 'right', trigger: 'hover'});
});