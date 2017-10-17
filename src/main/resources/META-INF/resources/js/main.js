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
	
	var _hpGradeParam = {
		rq   : {min:1, max:4},   /*RQ(종합부동산 투자지수)*/
		cpgr : {min:1, max:4},   /*건축허가면적 증가율(Construction Permit Growth Rate)*/
		bpgr : {min:1, max:4},   /*개발행위 허가면적 증가율(Betterment Permit Growth Rate)*/
		rtWgr: {min:1, max:4},   /*부동산실거래 면적 증가율(Real estate Transactions Width Growth Rate)*/
		rtPgr: {min:1, max:4},   /*부동산실거래 가격 증가율(Real estate Transactions Price Growth Rate)*/
		fpgr : {min:1, max:4},   /*유동인구 증가율(Floating Population Growth Rate)*/
		dpgr : {min:1, max:4},   /*개발사업 면적 증가율(Development Project Growth Rate)*/
		tigr : {min:1, max:4},   /*기반시설편입 필지수 증가율(Tranfer to Infra Growth Rate)*/
		blgr : {min:1, max:4}    /*영업허가 면적 증가율(Business License Growth Rate)*/
	}
	
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
		
		if(level >= hotplace.config.salesViewLevel) {
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
			var t = $('#' + targetIds[i]);
			t.rangeSlider({
				  bounds: {min: -10, max: -1},
				  step: 1,
				  defaultValues: {min:-4, max:-1},
				  formatter: function(val) {
					  //console.log(val)
					  return Math.abs(val) + '등급';
				  }
			});
			
			t.bind('valuesChanged', function(e, data) {
				var id = e.currentTarget.id;
				var values = data.values;
				
				_hpGradeParam[id].min = Math.abs(values.max);
				_hpGradeParam[id].max = Math.abs(values.min);
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
	
	function _btnCallback($this, e, targetId, isUseDiv, onFn, offFn) {
		var sw = $this.data('switch');
		$this.data('switch', ((sw == 'on') ? 'off' : 'on'));
		
		if(sw == 'off') {
			if(isUseDiv) {
				var padding = 5;
				var top  = e.currentTarget.offsetTop;
				var left = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth + padding;
				
				hotplace.dom.openLayer(targetId, {top:top, left:left});
			}
			if(onFn) onFn();
		}
		else {
			if(isUseDiv) hotplace.dom.closeLayer(targetId);
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
		  var target = $(e.target).attr('href') // activated tab
		  if(target == '#tabHPgradeSearch') {
			  _sliderInit('tabHPgradeSearch', [
			              'rq', 
				          'cpgr',
				          'bpgr',
				          'rtWgr',
				          'rtPgr',
				          'fpgr',
				          'dpgr',
				          'tigr',
				          'blgr']
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
		
		hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.RADIUS_SEARCH);
		
		hotplace.maps.panToBounds(lat, lng, function() {
			hotplace.maps.destroyMarkerType(hotplace.maps.MarkerTypes.RADIUS_SEARCH);
			
			hotplace.maps.getMarker(hotplace.maps.MarkerTypes.RADIUS_SEARCH, lat, lng, {
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
				datas: {
					params : $.extend({address:address}, hotplace.calc.profit.defaultValue, {
						jimok: '전',
						valPerPyeung:21000000,
						area: 1000,
						gongsi: 4000,
						limitChange:'Y'
					})
				}
			});
		});
	});
	
	var _selFilter = function(arr) {
		return function(cell, onRendered, success, cancel) {
			var len = arr.length;
			
			var htmlStr = '';
				
			for(var i=0; i<len; i++) {
				htmlStr += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
				console.log(htmlStr);
			}
				
			var editor = $('<select><option value=""></option>' + htmlStr + '</select>');
			editor.css({
				'padding':'3px',
		        'width':'100%',
		        'box-sizing':'border-box',
		    });
			 
			//Set value of editor to the current value of the cell
			editor.val(cell.getValue());
			  
			//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
			onRendered(function(){
				editor.focus();
				editor.css('height','100%');
			});
			 
			//when the value has been set, trigger the cell to update
			editor.on('change blur', function(e){
				success(editor.val());
			});
	
			//return the editor element
			return editor;
		}
	}
	
	//매물검색
	$('#btnSalesSearch').on('click', function() {
		hotplace.dom.insertFormInmodal('<div id="tbSales"></div>');
		hotplace.dom.openModal('매물(경매/공매/등록매물) 검색결과', 'fullsize');
		
		hotplace.dom.showMask('#containerModal');
		$('#tbSales').tabulator({
		    height:600, // set height of table
		    fitColumns:true, //fit columns to width of table (optional)
		    columns:[ //Define Table Columns
		        {title:'관심물건여부', field:'favor', formatter:'tick', width:50},
		        {title:'구분', field:'guboon', width:50, headerFilter:true, editor:_selFilter(['G', 'K', 'R'])},
		        {title:'물건유형', field:'type', width:50,  headerFilter:true, editor:_selFilter(['대','전','답','임야','하천','도로','건물'])},
		        {title:'주소', field:'addr', width:200,  headerFilter:'input', headerFilterPlaceholder:'주소검색'},
		        {title:'감정평가액', field:'gamjeong', formatter:'money', width:100},
		        {title:'최소입찰가', field:'minBid', formatter:'money', width:100},
		        {title:'최소입찰가율', field:'minBidRate', width:100},
		        {title:'종료일', field:'endDate', sorter:'date', width:100},
		        {title:'등록일', field:'regDate', sorter:'date', width:100},
		        {title:'RQ지수', field:'jisu', formatter:'star', formatterParams:{stars:10}, width:200, headerFilter:'number', headerFilterPlaceholder:'1 ~ 10'},
		    ],
		    rowClick:function(e, row){ //trigger an alert message when the row is clicked
		        alert("Row " + row.getData().id + " Clicked!!!!");
		    },
		});
		
		var tabledata = [
             {id:1, favor:true, guboon:'G', type:'대',  addr:'서울시 강남구 도곡동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:1},
             {id:2, favor:false, guboon:'K', type:'임야',  addr:'서울시 강남구 도곡동 963', gamjeong:'130000000', minBid:'50000000', minBidRate:'50.0%', endDate: '2015.02.15', regDate:'', jisu:10},
             {id:3, favor:false, guboon:'G', type:'전',  addr:'서울시 강남구 도곡동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:3},
             {id:4, favor:true, guboon:'K', type:'답',  addr:'서울시 강남구 대치동  963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:5},
             {id:5, favor:true, guboon:'R', type:'도로',  addr:'서울시 강남구 역삼동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:2},
             {id:6, favor:true, guboon:'G', type:'임야',  addr:'서울시 강남구 도곡동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:7},
             {id:6, favor:true, guboon:'R', type:'하천',  addr:'서울시 강남구 도곡동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:7},
             {id:6, favor:true, guboon:'G', type:'건물',  addr:'서울시 강남구 도곡동 963', gamjeong:'110000000', minBid:'90000000', minBidRate:'80.0%', endDate: '2018.08.15', regDate:'', jisu:7},
         ];
		
		setTimeout(function() {
			$("#tbSales").tabulator("setData", tabledata);
				hotplace.dom.hideMask();
		}, 1000);
	});
	
	//HP grade 검색폼 돌아가기
	$('#btnHPgradeBack').on('click', function() {
		$('#fmPin').show();
		$('#btnHPgradeSearch').show();
		
		$('#fmPinResult').hide();
		$('#btnHPgradeBack').hide();
	});

	//HP grade 검색
	$('#btnHPgradeSearch').on('click', function() {
		hotplace.ajax({
			url: 'hpgrade/search',
			contentType: 'application/json',
			data: JSON.stringify(_hpGradeParam),
			activeMask: true,
			loadEl:'#dvAddrSearch',
			success: function(data, textStatus, jqXHR) {
				
				$('#fmPin').hide();
				$('#btnHPgradeSearch').hide();
				
				$('#fmPinResult').show();
				$('#btnHPgradeBack').show();
				
				$('#dvHpgradeResult').tabulator({
				    height:670, // set height of table
				    fitColumns:true, //fit columns to width of table (optional)
				    columns:[ //Define Table Columns
				        {title:"위치", field:"addr", width:470},
				        {title:"RQ",  field:"rq", width:70},
				    ],
				    rowClick:function(e, row){ //trigger an alert message when the row is clicked
				        alert("Row " + row.getData().id + " Clicked!!!!");
				    },
				});
				
				var tabledata = [
	                 {id:1, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:2, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:3, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:4, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:5, addr:"서울시 강남구 도곡동 967", rq:"6"},
	                 {id:6, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:7, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:8, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:9, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:10, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:11, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:12, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:13, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:14, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:15, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:16, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:17, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:18, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:19, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:20, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:21, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:22, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:23, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:24, addr:"서울시 강남구 도곡동 966", rq:"5"},
	                 {id:25, addr:"서울시 강남구 도곡동 963", rq:"1"},
	                 {id:26, addr:"서울시 강남구 도곡동 964", rq:"1"},
	                 {id:27, addr:"서울시 강남구 도곡동 965", rq:"2"},
	                 {id:28, addr:"서울시 강남구 도곡동 966", rq:"5"},
	             ];
				
				$('#dvHpgradeResult').tabulator('setData', tabledata);
			},
			error: function() {
				//console.log('ii')
			}
		});
	});
	
	//물건보기 체크 이벤트
	$('#btnSearchSalesView').on('click', function(e) {
		var obj = {}
		$('#dvSalesView input[type="checkbox"]:not(:disabled)').each(function() {
			var type = $(this).data('value');
			obj[type] = $(this).prop('checked') ? 1 : 0;
		})
		.promise()
		.done(function() {
			hotplace.maps.setMarkers(obj);
			hotplace.maps.showMarkers();
		})
	});
	
	$('#btnCapture').on('click', function(event) {
		event.preventDefault();
		hotplace.dom.captureToCanvas();
	});
	
	/*****************************************************************************************************/
	
	var _prevLevel = 3;
	var _currLevel = 3;
	
	var _isLevelChanged = function() {
		return _prevLevel != _currLevel;
	}
	
	hotplace.maps.init('naver', {
		X: hotplace.config.mapDefaultX,
		Y: hotplace.config.mapDefaultY, 
		level: hotplace.config.minZoomLevel
	}, {
		'zoom_changed' : function(map, level) {
			_currLevel = level;
			hotplace.dom.addBodyAllMask();
			
			setTimeout(function() {
				hotplace.maps.showMarkers();
				hotplace.maps.showCellLayer();
				hotplace.dom.removeBodyAllMask();
				_enableMapButton(level, 'btnSalesView');
			},500);
		},
		'zoom_start' : function(map, level) {
			////hotplace.test.initMarker(level);
			_prevLevel = level;
			
			hotplace.maps.destroyMarkers();
			hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.RADIUS_SEARCH);
			hotplace.database.initLevel(level);
		},
		'dragend' : function(map, bnds) {
			//cell과 marker가 동시에 켜져있을 경우 
			if(!hotplace.maps.isOffCell()) {
				if(hotplace.maps.isInLocationBounds(bnds)) {
					hotplace.maps.appendCell();
					hotplace.maps.appendMarker();
				}
				else {
					hotplace.dom.showMaskTransaction((hotplace.maps.isActiveSalesView()) ? (1 + hotplace.maps.getActiveMarkers().length) : 1);
					hotplace.maps.showCellLayer(null, true);
					hotplace.maps.showMarkers(null, true);
				}
			}
			else {//marker만 켜져 있을 경우
				if(hotplace.maps.isInLocationBounds(bnds)) {
					hotplace.maps.appendMarker();
				}
				else {
					hotplace.maps.showMarkers();
				}
			}
		},
		'click' : function(map, latlng) {
			console.log(latlng)
			hotplace.maps.getClickedCell(latlng);
		},
		/*'tilesloaded': function(e) {
			console.log('tilesloaded');
		},
		'idle': function(e) {
			console.log('idle');
		}*/
	}, function(map) {
		hotplace.maps.showCellLayer();
		hotplace.dom.showYearRangeDiv();
		hotplace.dom.showAutoYearRangeDiv();
	});
	
	hotplace.dom.addButtonInMap([{
		id:'btnNews',
		glyphicon: 'list-alt',
		attr: 'data-switch="off" title="뉴스"',
		clazz: 'mBtnTooltip',
		callback: function(e) {
			_btnCallback($(this), e, 'dvNews', true, function() {
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
		attr: 'data-switch="off" title="주소,HP,반경,매물검색"',
		clazz: 'mBtnTooltip',
		callback: function(e) {
			_btnCallback($(this), e, 'dvAddrSearch', true);
		}
	},{
		id:'btnUser',
		glyphicon: 'user',
		//attr: 'data-switch="off"',
		callback: function() {
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
		attr: 'data-switch="off" title="물건보기"',
		disabled: true,
		clazz: 'mBtnTooltip',
		callback: function(e) {
			_btnCallback($(this), e, 'dvSalesView', true, null, function() {
				$('#salesGyeongmae').prop('checked', hotplace.maps.isActiveMarker(hotplace.maps.MarkerTypes.GYEONGMAE));
			});
		}
	},{
		id:'btnCadastral',
		attr: 'data-switch="off" title="지적도 보기"',
		glyphicon: 'globe',
		clazz: 'mBtnTooltip',
		callback: function() {
			var onOff = $(this).data('switch');
			hotplace.maps.showJijeokLayer(onOff, $(this));
			$(this).toggleClass('button-on')
		}
	}, {
		id:'btnLayerView',
		glyphicon: 'plus',
		attr: 'data-switch="on" title="heatmap보기"',
		clazz: 'button-on mBtnTooltip',
		callback: function(e) {
			//hotplace.dom.captureToCanvas();
			_btnCallback($(this), e, null, false, function() {
				hotplace.maps.cellToggle();
			}, function() {
				hotplace.maps.cellToggle();
			});
		}
	}]);
	
	hotplace.validation.numberOnly('.numberOnly');
	hotplace.validation.numberNdot('.numberNdot');
	
	hotplace.dom.initTooltip('htooltip');
	hotplace.dom.initTooltip('mBtnTooltip',{side: 'right', trigger: 'hover'});
	
	hotplace.calc.profit.init();
});